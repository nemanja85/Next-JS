.PHONY: setup
setup:
	yarn
	cp .env.example .env
	./runme.sh
