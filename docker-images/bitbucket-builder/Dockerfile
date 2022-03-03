FROM node:lts-buster-slim

# The base image includes a 'node' user for running.
# Make sure we use a priviledged used for global installs
USER root

# General dependencies for installing/working with other packages in future layers
RUN set -ex; \
   apt-get update; \
   apt-get install -y --no-install-recommends \
   bash \
   build-essential \
   ca-certificates \
   curl \
   dirmngr \
   jq \
   git \
   gnupg \
   gzip \
   make \
   python3 \
   python3-pip \
   pipenv \
   tar \
   unzip \
   wget \
   ; \
   rm -rf /var/lib/apt/lists/*;

RUN set -ex; \
   npm install npm@latest -g

# make the "en_US.UTF-8" locale so it can be enabled by default
RUN set -eux; \
   if [ -f /etc/dpkg/dpkg.cfg.d/docker ]; then \
   # if this file exists, we're likely in "debian:xxx-slim", and locales are thus being excluded so we need to remove that exclusion (since we need locales)
   grep -q '/usr/share/locale' /etc/dpkg/dpkg.cfg.d/docker; \
   sed -ri '/\/usr\/share\/locale/d' /etc/dpkg/dpkg.cfg.d/docker; \
   ! grep -q '/usr/share/locale' /etc/dpkg/dpkg.cfg.d/docker; \
   fi; \
   apt-get update; apt-get install -y --no-install-recommends locales; rm -rf /var/lib/apt/lists/*; \
   localedef -i en_US -c -f UTF-8 -A /usr/share/locale/locale.alias en_US.UTF-8
ENV LANG en_US.utf8

# Dependencies for AWS CLIs
RUN set -ex; \
   apt-get update; \
   apt-get install -y --no-install-recommends \
   groff-base \
   ; \
   rm -rf /var/lib/apt/lists/*;

# Install AWS CLI
# https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2-linux.html
COPY awsCLI.pub .
COPY awsECSCLI.pub .

RUN set -ex; \
   curl -o awscliv2.zip -k 'https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip' ; \
   curl -o awscliv2.sig -k 'https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip.sig' ; \
   gpg --import awsCLI.pub; \
   gpg --verify awscliv2.sig awscliv2.zip; \
   unzip awscliv2.zip; \
   ./aws/install; \
   aws --version \
   ; \
   rm awsCLI.pub awscliv2.sig awscliv2.zip;

# Install ECS CLI
# https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ECS_CLI_installation.html
RUN set -ex; \
   curl -Lo /usr/local/bin/ecs-cli -k 'https://amazon-ecs-cli.s3.amazonaws.com/ecs-cli-linux-amd64-latest' ; \
   curl -Lo ecs-cli.asc -k 'https://amazon-ecs-cli.s3.amazonaws.com/ecs-cli-linux-amd64-latest.asc' ; \
   gpg --import awsECSCLI.pub; \
   gpg --verify ecs-cli.asc /usr/local/bin/ecs-cli; \
   chmod +x /usr/local/bin/ecs-cli; \
   ecs-cli --version \
   ; \
   rm awsECSCLI.pub ecs-cli.asc ;

# Install Golang (needed for Terratest)
ADD https://golang.org/dl/go1.17.2.linux-amd64.tar.gz /

RUN rm -rf /usr/local/go && \
   tar -C /usr/local -xzf go1.17.2.linux-amd64.tar.gz && \
   export PATH=$PATH:/usr/local/go/bin && \
   echo "export PATH=$PATH:/usr/local/go/bin" >> /etc/profile && \
   rm go1.17.2.linux-amd64.tar.gz && \
   go version 

# Install Terraform, Terragrunt, Terraform doc
RUN set -ex; \
   curl -Lo terraform_1.0.8.zip -k 'https://releases.hashicorp.com/terraform/1.0.8/terraform_1.0.8_linux_amd64.zip' ; \
   unzip terraform_1.0.8.zip; \
   mv terraform /usr/local/bin; \
   chmod a+x /usr/local/bin/terraform; \
   rm terraform_1.0.8.zip; \
   terraform version \
   ;

RUN set -ex; \
   curl -sSLo ./terraform-docs.tar.gz https://terraform-docs.io/dl/v0.16.0/terraform-docs-v0.16.0-$(uname)-amd64.tar.gz; \
   tar -xzf terraform-docs.tar.gz; \
   chmod +x terraform-docs; \
   mv terraform-docs /usr/local/bin; \
   rm terraform-docs.tar.gz; \
   terraform-docs version \
   ;

# Python goodies needed to build scrapers correctly
RUN /bin/sh -c pip3 install setuptools wheel; \
   pip3 install python-Levenshtein

ENTRYPOINT [ "docker-entrypoint.sh" ]
CMD ["node"]
