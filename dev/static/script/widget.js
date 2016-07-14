(function ($) {
	 var Widget ={}
	if (typeof define === 'function' && define.amd) {
        define(function () {
            return Widget;
        });
    } else {
        $.fn.Widget = Widget;
    }
})(window.jQuery)