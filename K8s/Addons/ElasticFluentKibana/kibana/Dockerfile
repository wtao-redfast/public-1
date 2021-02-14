#
# ** THIS IS AN AUTO-GENERATED FILE **
#

################################################################################
# Build stage 0
# Extract Kibana and make various file manipulations.
################################################################################
FROM centos:7 AS prep_files

ARG TARGETARCH

# Add tar and gzip
RUN yum update -y && yum install -y tar gzip && yum clean all
RUN if [ "$TARGETARCH" == "arm64" ]; \
    then curl --retry 8 -L https://artifacts.elastic.co/downloads/kibana/kibana-oss-7.9.3-linux-aarch64.tar.gz -o /opt/kibana-7.9.3-linux.tar.gz; \
    else curl --retry 8 -L https://artifacts.elastic.co/downloads/kibana/kibana-oss-7.9.3-linux-x86_64.tar.gz -o /opt/kibana-7.9.3-linux.tar.gz; \
    fi

RUN mkdir /usr/share/kibana
WORKDIR /usr/share/kibana
RUN tar --strip-components=1 -zxf /opt/kibana-7.9.3-linux.tar.gz
RUN rm /opt/kibana-7.9.3-linux.tar.gz
# Ensure that group permissions are the same as user permissions.
# This will help when relying on GID-0 to run Kibana, rather than UID-1000.
# OpenShift does this, for example.
# REF: https://docs.openshift.org/latest/creating_images/guidelines.html
RUN chmod -R g=u /usr/share/kibana
RUN find /usr/share/kibana -type d -exec chmod g+s {} \;

################################################################################
# Build stage 1
# Copy prepared files from the previous stage and complete the image.
################################################################################
FROM centos:7
EXPOSE 5601

ARG TARGETARCH

# Add Reporting dependencies.
RUN yum update -y && yum install -y fontconfig freetype shadow-utils && yum clean all

# Add an init process, check the checksum to make sure it's a match
RUN if [ "$TARGETARCH" == "arm64" ]; \
    then curl -L -o /usr/local/bin/dumb-init https://github.com/Yelp/dumb-init/releases/download/v1.2.2/dumb-init_1.2.2_aarch64; \
    else curl -L -o /usr/local/bin/dumb-init https://github.com/Yelp/dumb-init/releases/download/v1.2.2/dumb-init_1.2.2_amd64; \
    fi

RUN chmod +x /usr/local/bin/dumb-init

# Bring in Kibana from the initial stage.
COPY --from=prep_files --chown=1000:0 /usr/share/kibana /usr/share/kibana
WORKDIR /usr/share/kibana
RUN ln -s /usr/share/kibana /opt/kibana

ENV ELASTIC_CONTAINER true
ENV PATH=/usr/share/kibana/bin:$PATH

# Set some Kibana configuration defaults.
COPY --chown=1000:0 config/kibana.yml /usr/share/kibana/config/kibana.yml

# Add the launcher/wrapper script. It knows how to interpret environment
# variables and translate them to Kibana CLI options.
COPY --chown=1000:0 bin/kibana-docker /usr/local/bin/

# Ensure gid 0 write permissions for OpenShift.
RUN chmod g+ws /usr/share/kibana && find /usr/share/kibana -gid 0 -and -not -perm /g+w -exec chmod g+w {} \;

# Remove the suid bit everywhere to mitigate "Stack Clash"
RUN find / -xdev -perm -4000 -exec chmod u-s {} +

# Provide a non-root user to run the process.
RUN groupadd --gid 1000 kibana && useradd --uid 1000 --gid 1000 --home-dir /usr/share/kibana --no-create-home kibana
USER kibana

LABEL org.label-schema.schema-version="1.0" org.label-schema.vendor="Elastic" org.label-schema.name="kibana" org.label-schema.version="7.9.3" org.label-schema.url="https://www.elastic.co/products/kibana" org.label-schema.vcs-url="https://github.com/elastic/kibana" org.label-schema.license="Elastic License" org.label-schema.usage="https://www.elastic.co/guide/en/kibana/index.html" org.label-schema.build-date="2020-10-16T11:38:18.955Z" license="Elastic License"

ENTRYPOINT ["/usr/local/bin/dumb-init", "--"]

CMD ["/usr/local/bin/kibana-docker"]