/* @projectDescription jQuery Serialize Anything - Serialize anything (and not just forms!)
 * @author Bramus! (Bram Van Damme)
 * @version 1.0
 * @website: http://www.bram.us/
 * @license : BSD
*/

(function($) {

	$.fn.serializeAnything = function(hasData) {

		var toReturn	= [];
		var els 		= $(this).find(':input').get();

		$.each(els, function() {
			
			if (this.name && !this.disabled && (this.checked || /select|textarea/i.test(this.nodeName) || /text|hidden|password|color|date|datetime|datetime-local|email|month|number|range|search|tel|time|url|week/i.test(this.type))) {
				var val = (typeof $(this).data('value') != 'undefined' && typeof hasData != 'undefined')? $(this).data('value') : $(this).val();
				toReturn.push( encodeURIComponent(this.name) + "=" + encodeURIComponent( val ) );
			}
		});

		//return toReturn.join("&").replace(/%20/g, "+");
		return toReturn.join("&");

	}

})(jQuery);