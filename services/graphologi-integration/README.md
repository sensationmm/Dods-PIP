## Creating layers for python lambda ##
```docker run -v $(pwd)/layer:/outputs -it amazonlinux```

``` yum update -y
yum install -y \
python3 \
python3-devel \
python3-setuptools \
gcc \
gcc-c++ \
findutils \
rsync \
Cython \
findutils \
which \
gzip \
tar \
man-pages \
man \
wget \
make \
zip
```

```pip3.7 install pandas```

```cp -r  /usr/local/lib64/python3.7/site-packages/* outputs```

```cp -r  /usr/local/lib/python3.7/site-packages/* outputs```