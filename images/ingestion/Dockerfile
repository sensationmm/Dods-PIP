# To build/deploy scrapers we need both Node.js and Python on the same image
# Use a base with Node.js and put Python on it
FROM node:lts-bullseye-slim

USER root

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

# Shamesly copy the Dockerfile from official python 3.9 bullseye slim 
# https://github.com/docker-library/python/blob/6a2c0f48f011aa279a0c9190725fc84a220460bc/3.9/bullseye/slim/Dockerfile
# ...

# ensure local python is preferred over distribution python
ENV PATH /usr/local/bin:$PATH

# http://bugs.python.org/issue19846
# > At the moment, setting "LANG=C" on a Linux system *fundamentally breaks Python 3*, and that's not OK.
ENV LANG C.UTF-8

# runtime dependencies
RUN set -eux; \
   apt-get update; \
   apt-get install -y --no-install-recommends \
   ca-certificates \
   netbase \
   tzdata \
   ; \
   rm -rf /var/lib/apt/lists/*

ENV GPG_KEY E3FF2839C048B25C084DEBE9B26995E310250568
ENV PYTHON_VERSION 3.9.10

RUN set -ex \
   \
   && savedAptMark="$(apt-mark showmanual)" \
   && apt-get update && apt-get install -y --no-install-recommends \
   dpkg-dev \
   gcc \
   libbluetooth-dev \
   libbz2-dev \
   libc6-dev \
   libexpat1-dev \
   libffi-dev \
   libgdbm-dev \
   liblzma-dev \
   libncursesw5-dev \
   libreadline-dev \
   libsqlite3-dev \
   libssl-dev \
   make \
   tk-dev \
   uuid-dev \
   wget \
   xz-utils \
   zlib1g-dev \
   # as of Stretch, "gpg" is no longer included by default
   $(command -v gpg > /dev/null || echo 'gnupg dirmngr') \
   \
   && wget -O python.tar.xz "https://www.python.org/ftp/python/${PYTHON_VERSION%%[a-z]*}/Python-$PYTHON_VERSION.tar.xz" \
   && wget -O python.tar.xz.asc "https://www.python.org/ftp/python/${PYTHON_VERSION%%[a-z]*}/Python-$PYTHON_VERSION.tar.xz.asc" \
   && export GNUPGHOME="$(mktemp -d)" \
   && gpg --batch --keyserver hkps://keys.openpgp.org --recv-keys "$GPG_KEY" \
   && gpg --batch --verify python.tar.xz.asc python.tar.xz \
   && { command -v gpgconf > /dev/null && gpgconf --kill all || :; } \
   && rm -rf "$GNUPGHOME" python.tar.xz.asc \
   && mkdir -p /usr/src/python \
   && tar -xJC /usr/src/python --strip-components=1 -f python.tar.xz \
   && rm python.tar.xz \
   \
   && cd /usr/src/python \
   && gnuArch="$(dpkg-architecture --query DEB_BUILD_GNU_TYPE)" \
   && ./configure \
   --build="$gnuArch" \
   --enable-loadable-sqlite-extensions \
   --enable-optimizations \
   --enable-option-checking=fatal \
   --enable-shared \
   --with-system-expat \
   --with-system-ffi \
   --without-ensurepip \
   && make -j "$(nproc)" \
   LDFLAGS="-Wl,--strip-all" \
   && make install \
   && rm -rf /usr/src/python \
   \
   && find /usr/local -depth \
   \( \
   \( -type d -a \( -name test -o -name tests -o -name idle_test \) \) \
   -o \( -type f -a \( -name '*.pyc' -o -name '*.pyo' -o -name '*.a' \) \) \
   \) -exec rm -rf '{}' + \
   \
   && ldconfig \
   \
   && apt-mark auto '.*' > /dev/null \
   && apt-mark manual $savedAptMark \
   && find /usr/local -type f -executable -not \( -name '*tkinter*' \) -exec ldd '{}' ';' \
   | awk '/=>/ { print $(NF-1) }' \
   | sort -u \
   | xargs -r dpkg-query --search \
   | cut -d: -f1 \
   | sort -u \
   | xargs -r apt-mark manual \
   && apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false \
   && rm -rf /var/lib/apt/lists/* \
   \
   && python3 --version

# make some useful symlinks that are expected to exist
RUN cd /usr/local/bin \
   && ln -s idle3 idle \
   && ln -s pydoc3 pydoc \
   && ln -s python3 python \
   && ln -s python3-config python-config

# if this is called "PIP_VERSION", pip explodes with "ValueError: invalid truth value '<VERSION>'"
ENV PYTHON_PIP_VERSION 21.2.4
# https://github.com/docker-library/python/issues/365
ENV PYTHON_SETUPTOOLS_VERSION 57.5.0
# https://github.com/pypa/get-pip
ENV PYTHON_GET_PIP_URL https://github.com/pypa/get-pip/raw/3cb8888cc2869620f57d5d2da64da38f516078c7/public/get-pip.py
ENV PYTHON_GET_PIP_SHA256 c518250e91a70d7b20cceb15272209a4ded2a0c263ae5776f129e0d9b5674309

RUN set -ex; \
   \
   savedAptMark="$(apt-mark showmanual)"; \
   apt-get update; \
   apt-get install -y --no-install-recommends wget; \
   \
   wget -O get-pip.py "$PYTHON_GET_PIP_URL"; \
   echo "$PYTHON_GET_PIP_SHA256 *get-pip.py" | sha256sum --check --strict -; \
   \
   apt-mark auto '.*' > /dev/null; \
   [ -z "$savedAptMark" ] || apt-mark manual $savedAptMark; \
   apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false; \
   rm -rf /var/lib/apt/lists/*; \
   \
   python get-pip.py \
   --disable-pip-version-check \
   --no-cache-dir \
   "pip==$PYTHON_PIP_VERSION" \
   "setuptools==$PYTHON_SETUPTOOLS_VERSION" \
   ; \
   pip --version; \
   \
   find /usr/local -depth \
   \( \
   \( -type d -a \( -name test -o -name tests -o -name idle_test \) \) \
   -o \
   \( -type f -a \( -name '*.pyc' -o -name '*.pyo' \) \) \
   \) -exec rm -rf '{}' +; \
   rm -f get-pip.py

# ... back to Dods specific context
RUN pip install pipenv

# Libraries and packages needed to use this image as a builder on Bitbucket
RUN set -ex; \
   \
   savedAptMark="$(apt-mark showmanual)"; \
   apt-get update; \
   apt-get install -y --no-install-recommends \
   bash \
   jq \
   gcc \
   git \
   gzip \
   tar \
   unzip \
   ; \
   rm -rf /var/lib/apt/lists/*;

RUN set -ex; \
   npm install npm@latest -g

# Scrapers will be deployed to AWS Lambdas using the Serverless framework
# plus some Serverless plugins, so makes to keep them on the image and avoid
# installing these on every build/deploy

COPY package.json .
RUN npm install

# Libraries and packages needed to build python-levenshtein
RUN set -ex; \
   \
   savedAptMark="$(apt-mark showmanual)"; \
   apt-get update; \
   apt-get install -y --no-install-recommends \
   libc6-dev \
   linux-libc-dev\
   ; \
   rm -rf /var/lib/apt/lists/*;

CMD ["bash"]
