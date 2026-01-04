const renderTemplate = (template, data) => {
	return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
		return data[key] !== undefined ? data[key] : match;
	});
};

const sanitizeVariableName = (name) => {
	// Remove invalid characters like <, >, -, etc.
	return name.replace(/[^a-zA-Z0-9_$]/g, "_");
};

const javaCallFormat = (args) => {
	return args.map((arg, index) => `${arg.java} arg${index + 1}`).join(", ");
};

module.exports = {
	renderTemplate,
	sanitizeVariableName,
	javaCallFormat
};
