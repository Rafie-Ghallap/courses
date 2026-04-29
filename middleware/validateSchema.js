const validateSchema = function validate(schema, source = "body") {
	return (req, res, next) => {
		try {
			const result = schema.parse(req[source]);
			req[source] = result;
			next();
		} catch (error) {
			return res
				.status(400)
				.json({ success: false, errors: error.errors.map((e) => e.message) });
		}
	};
};

module.exports = { validateSchema };