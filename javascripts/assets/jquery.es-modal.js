/**
 * @name Es Modal Plugin
 * @description Dependant on jQueryUI
 */
(function($)
{
	"use strict";

	var $this, settings;

	$.fn.esDialog = function(options)
	{
		$this = $(this);

		if (!$this.data('init'))
		{
			$this.data('init', true);
		}

		if ('string' === typeof options)
		{
			if ($this.data('init'))
			{
				settings = $this.data('settings');
			}

			doAction(options);
		}
		else
		{
			settings = $.extend({}, $.fn.esDialog.defaults, options);

			if ($this.data('init'))
			{
				$this.data('settings', settings);
			}

			$.fn.esDialog.init();

			if (false !== settings.autoOpen)
			{
				$.fn.esDialog.open();
			}
		}

		return $this;
	};

	$.fn.esDialog.defaults = {
		title: '',
		autoOpen: true,
		closeOnEscape: false,
		maxHeight: null,
		position: {
			of: $(window),
			collision: 'none'
		},
		innerBlockTitleIdentifier: '',
		innerBlockIdentifier: '',
		scroolableBackground: false
	};

	function createOverlay()
	{
		var style = $('<div class="es-modal-style"></div>');
		style.appendTo('body');

		$("<style type='text/css'>" +
			".es-modal-overlay {display:none; position:fixed; z-index:1001; background-color:#000; bottom:0; left:0; opacity:0.8; right:0; top:0;}\n" +
			".es-modal {z-index:1002; position:absolute !important; height:auto; outline:0; overflow:hidden; padding:.2em; background-color:#FFF;}" +
			"</style>").appendTo(style);

		$('<div class="es-modal-overlay"></div>').appendTo('body');
		$('.es-modal-overlay').show();
	}

	function destroyOverlay()
	{
		$('.es-modal-style').remove();
		$('.es-modal-overlay').remove();
	}

	function drawTitle(elem, options)
	{
		if ('' != options.title.trim())
		{
			elem.find(options.innerBlockTitleIdentifier).text(options.title);
		}
	}

	function center(elem, options)
	{
		var maxHeight    = options.maxHeight;
		var innerElement = $(elem.find(options.innerBlockIdentifier)[0]);

		if (null === maxHeight)
		{
			maxHeight = ($(window).height() - 90) + 'px';
		}

		innerElement.css({maxHeight: maxHeight});
		elem.height(maxHeight - 40);

		elem.position(options.position);

		var innerElementPosition = $.extend({}, options.position, {of: elem});
		innerElement.position(innerElementPosition);
		elem.trigger('es-modal-resize');
	}

	function doAction(action)
	{
		switch (action)
		{
			case 'close':
				$.fn.esDialog.close();
				break;

			case 'resize':
				center($this, settings);
				break;

			case 'open':
				$.fn.esDialog.open();
				break;
		}
	}

	$.fn.esDialog.init = function()
	{
		drawTitle($this, settings);

		if (true === settings.closeOnEscape)
		{
			$(document).live('keyup', function(e)
			{
				if (e.keyCode == 27) // esc
				{
					$.fn.esDialog.close();
				}
			});
		}
	};

	$.fn.esDialog.close = function()
	{
		$this.removeAttr('style');
		$this.hide();
		destroyOverlay();

		if ($this.hasClass('es-modal'))
		{
			$this.removeClass('es-modal');
			$this.find(settings.innerBlockIdentifier).removeAttr('style');
		}

		if (!settings.scroolableBackground)
		{
			$('body').css({overflowY: 'auto', overflowX: 'auto'});
		}

		$this.trigger('es-modal-close');
	};

	$.fn.esDialog.open = function()
	{
		destroyOverlay();
		createOverlay();

		if (!settings.scroolableBackground)
		{
			$('body').css({overflow: 'hidden'});
		}

		if (!$this.hasClass('es-modal'))
		{
			$this.addClass('es-modal');
		}

		center($this, settings);

		$this.trigger('es-modal-open');
		$this.show();
	};
})(jQuery);