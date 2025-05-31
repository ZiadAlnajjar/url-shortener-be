.PHONY: copy-shared-env
copy-shared-env:
	@for dir in ../../apps/*; do \
	  if [ -d "$$dir" ]; then \
	    cp .env "$$dir/.env.shared"; \
	    echo "Copied .env to $$dir/.env.shared"; \
	  fi; \
	done
