module.exports = `Java.perform(function() {
	// {{smali_signature}}
	// {{method_signature}}

	const {{class_var}} = Java.use("{{class_name}}");

	const {{method_var}} = {{class_var}}.{{method_name}}.overload(
{{overload_args}}
	);

	{{method_var}}.implementation = function(
{{implementation_args}}
	) {
		return {{method_var}}.call(
			this,
{{call_args}}
		);
	};
});`;
