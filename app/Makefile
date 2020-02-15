.DEFAULT_GOAL := dev

prepare:
	@npm install

format: prepare
	@npm run format

dev: format
	@npm run build

production: dev
	@rm -r node_modules
	@rm package-lock.json
	@npm install --production
