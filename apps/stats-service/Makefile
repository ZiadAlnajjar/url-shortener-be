include .env
include .tools

DB_ENGINE ?= postgres:latest
DOCKERFILE := Dockerfile.db
DOCKER_TEMPLATE_FILE := db.dockerfile.in
GENERATED_HEADER := GENERATED FILE - DO NOT EDIT


.PHONY: __check_vars

__check_vars:
	$(foreach var,$(REQUIRED_VARS),\
		$(if $(strip $($(var))),,$(error Required variable '$(var)' is not set)))


.PHONY: generate-db-dockerfile

generate-db-dockerfile: REQUIRED_VARS := DB_USERNAME DB_PROVIDER
generate-db-dockerfile: __check_vars
	@DB_CONFIG=""; \
	case "$(DB_ENGINE)" in \
		postgres) \
			DB_CONFIG+=$$'\n''ENV POSTGRES_USER="$${DB_USERNAME}"' \
			DB_CONFIG+=$$'\n''ENV POSTGRES_PASSWORD="$${DB_PASSWORD}"' \
			DB_CONFIG+=$$'\n''ENV POSTGRES_DB="$${DB_DATABASE}"' \
			DB_CONFIG+=$$'\n''ENV PGPORT="$${DB_PORT}"' \
			DB_CONFIG+=$$'\n''ENV PGDATA="$${DATA_DIR}"' \
			;; \
		mysql) \
			if [ "$(DB_USERNAME)" != "root" ]; then \
				DB_CONFIG+=$$'\n''ENV MYSQL_USER="$${DB_USERNAME}"' \
				DB_CONFIG+=$$'\n''ENV MYSQL_PASSWORD="$${DB_PASSWORD}"'; \
			fi; \
			DB_CONFIG+=$$'\n''ENV MYSQL_ROOT_PASSWORD="$${DB_PASSWORD}"' \
			DB_CONFIG+=$$'\n''ENV MYSQL_DATABASE="$${DB_DATABASE}"' \
			DB_CONFIG+=$$'\n''ENV MYSQL_TCP_PORT="$${DB_PORT}"'; \
			DB_CONFIG+=$$'\n\n''CMD ["mysqld", "--datadir=$${DATA_DIR}"]'; \
			;; \
		*) \
			echo "Unsupported DB_ENGINE: $(DB_ENGINE)" \
			echo "Possible DB_ENGINE values: postgres, mysql" \
			exit 1; \
			;; \
	esac; \
	echo "$$DB_CONFIG" > .tmp.db_env; \
	sed '/# DB_SPECIFIC_CONFIGURATION/ r .tmp.db_env' $(DOCKER_TEMPLATE_FILE) > $(DOCKERFILE); \
	rm .tmp.db_env; \
	sed -i '/# syntax=docker\/dockerfile/a \\ \n# $(GENERATED_HEADER)' $(DOCKERFILE); \
	sed -i "s/\$$DB_ENGINE/$(DB_ENGINE)/" $(DOCKERFILE); \
	echo "$(DOCKERFILE) is generated";


.PHONY: update-prisma-provider

generate-db-dockerfile: REQUIRED_VARS := DB_USERNAME DB_PROVIDER
update-prisma-provider:
	@PRISMA_BASE_SCHEMA=schema.prisma; \
	awk ' \
		prev ~ /datasource db/ && $$0 ~ /provider = / { \
			sub(/provider = "[^"]+"/, "provider = \"$(DB_PROVIDER)\"") \
		} \
		{ print; prev = $$0 }' \
		$$PRISMA_BASE_SCHEMA > $$PRISMA_BASE_SCHEMA.tmp \
		&& mv $$PRISMA_BASE_SCHEMA.tmp $$PRISMA_BASE_SCHEMA;
