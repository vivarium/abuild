.DEFAULT_GOAL := dev

prepare:
	@npm install

format: prepare
	@npm run format

dev: format
	if [ -d dist ]; then rm -r dist; fi
	@npm run build

production: dev
	@rm -r node_modules
	@rm package-lock.json
	@npm install --production
