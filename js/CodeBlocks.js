/**
 * Library for helping with CodeBlocks!
 */
(function($, Core, Routing){

    var app = function($wrapper) {
        this.$wrapper = $wrapper;

        this.initialize();
    };

    $.extend(app.prototype, {
        $wrapper: null,
        zeroClipboardClient: null,

        initialize: function() {
            this.$wrapper
                .on('click', '.js-expand-all', $.proxy(this._handleLoadAllLines, this))
                .on('click', '.line-number-expandable', $.proxy(this._handleLoadMoreLines, this))
            ;
            this.zeroClipboardClient = new ZeroClipboard(
                this.$wrapper.find('.js-activate-clipboard')
            );

            this.$wrapper.find('.js-activate-clipboard').tooltip();
            this.$wrapper.find('.js-expand-all').tooltip();
            this.$wrapper.find('.line-number-expandable .js-icon-load-more').tooltip();

            this.zeroClipboardClient.on('copy', function (event) {
                var $target = $(event.target);
                var $codeTable = $target.closest('.code-block-wrapper').find('.code-block-table');

                var clipboard = event.clipboardData;
                var text = '';
                $codeTable.find('.blob-code, .gap-line').each(function() {
                    // add the code, only if we have the actual code line
                    if ($(this).hasClass('blob-code')) {
                        text += $(this).text();
                    }

                    // add a line either way
                    text += "\n";
                });
                clipboard.setData('text/plain', text);
            });
        },

        _handleLoadAllLines: function(e) {
            e.preventDefault();

            var $el = $(e.currentTarget);
            // avoid duplicate loading
            if ($el.hasClass('expanding')) {
                return;
            }
            $el.addClass('expanding');

            var $trContainer = $el.closest('.code-block-wrapper').find('.js-tr-container');
            var guid = $el.closest('.code-block-wrapper').data('code-block-guid');
            var range = $el.data('range');
            var rangeArr = range.split('-');
            var startLine = parseInt(rangeArr[0]);
            var endLine = parseInt(rangeArr[1]);

            $.ajax({
                url: Routing.generate('code_block_expand', {
                    'guid': guid
                })+'?startLine='+startLine+'&endLine='+endLine
            }).done(function(data) {
                $trContainer.html($.parseHTML(data));

                // remove the loading animation stuff and hide button
                $el.removeClass('expanding').hide();

                // show that this was triggered!
                Core.triggerWoopraAction(
                    'code_block.expanded'
                );
            });
        },

        _handleLoadMoreLines: function(e) {
            e.preventDefault();

            var $el = $(e.currentTarget);
            var guid = $el.closest('.code-block-wrapper').data('code-block-guid');

            // avoid duplicate loading
            if ($el.hasClass('expanding')) {
                return;
            }
            $el.addClass('expanding');

            // load extra lines on a gap. We have a situation like this:
            /*
             * [GAP] Lines 1-32
             * [33 ] if ($foo) {
             * [34 ]     echo 'Foo again';
             * [35 ] }
             * [GAP] Lines 36-60
             * [61 ] echo 'Foo';
             * [62 ] echo 'Bar';
             * [GAP] Lines 63-99
             */
            // if the gap is last, load up to 20 lines after the previous code block (e.g. 63-82)
            // otherwise, load up to 20 lines before the next code block (e.g. 3-32 or 41-60)

            // will be a range line 16-20
            var range = $el.data('range');
            var rangeArr = range.split('-');
            var originalRangeStart = parseInt(rangeArr[0]);
            var originalRangeEnd = parseInt(rangeArr[1]);

            // Declare auxiliary vars
            var startLine = 0;
            var endLine = 0;
            var newRangeStart = 0;
            var newRangeEnd = 0;

            // is this the last code block?
            var isLast = $el.data('last');
            if (isLast) {
                // get first 20 lines of the gap
                startLine = originalRangeStart;
                // get 20 lines or up until the last line, whatever is lower
                endLine = Math.min(startLine+20, rangeArr[1]);

                // new gap: the last line we fetched + 1 .. the original range end
                newRangeStart = (endLine+1);
                newRangeEnd = originalRangeEnd;
            } else {
                // get the last 20 lines of the gap
                endLine = originalRangeEnd;
                // get 20 lines before the end or up to the start, whatever is higher
                startLine = Math.max(endLine-20, rangeArr[0]);

                // new gap: the original range start .. the start we just fetched - 1
                newRangeStart = originalRangeStart;
                newRangeEnd = (startLine-1);
            }
            // set the new internal range
            $el.data('range', newRangeStart+'-'+newRangeEnd);

            $.ajax({
                url: Routing.generate('code_block_expand', {
                    'guid': guid
                })+'?startLine='+startLine+'&endLine='+endLine
            }).done(function(data) {
                var $tr = $el.closest('tr');

                if (isLast) {
                    // place the code right *before* the gap element, push the gap down
                    $tr.before($.parseHTML(data));
                } else {
                    // place the code right *after* the gap element, keep the gap above
                    $tr.after($.parseHTML(data));
                }

                // now maybe the gap is gone?
                if (newRangeStart >= newRangeEnd) {
                    // this gap is gone!
                    $tr.remove();
                }

                // and update the text
                // text repeated in the template
                if (newRangeStart == newRangeEnd) {
                    $tr.find('.gap-line').html('... line ' + newRangeStart);
                } else {
                    $tr.find('.gap-line').html('... lines ' + newRangeStart + ' - ' + newRangeEnd);
                }

                // remove the loading animation stuff
                $el.removeClass('expanding');

                // show that this was triggered!
                Core.triggerWoopraAction(
                    'code_block.expanded'
                );
            });
        }
    });

    Core.CodeBlocks = app;

})(jQuery, Core, Routing);