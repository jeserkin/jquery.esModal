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
		$this    = $(this);
		settings = $.fn.esDialog.defaults;

		if (typeof options === 'string')
		{
			doAction(options);
		}
		else
		{
			settings = $.extend({}, $.fn.esDialog.defaults, options);
			$.fn.esDialog.init();

			if (false !== settings.auto_open)
			{
				$.fn.esDialog.open();
			}

			if (null !== settings.action)
			{
				doAction(settings.action);
			}
		}

		return $this;
	};

	$.fn.esDialog.defaults = {
		title: '',
		auto_open: true,
		close_on_escape: false,
		maxHeight: null,
		position: {
			of: $(window),
			collision: 'none'
		},
		modal_title_id: '',
		modal_content_id: '',
		scroolable_background: false
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
		if ('' != options.title)
		{
			elem.find(options.modal_title_id).text(options.title);
		}
	}

	function center(elem, options)
	{
		var maxHeight    = options.maxHeight;
		var innerElement = $(elem.find(options.modal_content_id)[0]);

		if ( null === maxHeight )
		{
			maxHeight = ($(window).height() - 90) + 'px';
		}

		innerElement.css({maxHeight: maxHeight});
		elem.height( maxHeight - 40 );

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

		if (true === settings.close_on_escape)
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
			$this.find(settings.modal_content_id).removeAttr('style');
		}

		if (!settings.scroolable_background)
		{
			$('body').css({overflowY: 'auto', overflowX: 'auto'});
		}

		$this.trigger('es-modal-close');
	};

	$.fn.esDialog.open = function()
	{
		destroyOverlay();
		createOverlay();

		if (!settings.scroolable_background)
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
