module.exports = `XposedHelpers.{{xposed_helper}}(
	"{{class_name}}",
	lpparam.classLoader,
{{method_name_arg}}
{{xposed_args}}
	new XC_MethodHook() {
		@Override
		protected void beforeHookedMethod(MethodHookParam param) throws Throwable {
			super.beforeHookedMethod(param);
{{before_hook_args}}
		}

		@Override
		protected void afterHookedMethod(MethodHookParam param) throws Throwable {
			super.afterHookedMethod(param);
{{after_hook_args}}
		}
	}
);`;
