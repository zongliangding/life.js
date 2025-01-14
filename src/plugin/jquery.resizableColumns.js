define(function(require,exports,module){

    /**
     * 修改记录：
     * 1. 2014.05.29 adam(linyue@live.cn) 封装成sea.js的模块
     * 2. 2014.06.03 adam(linyue@live.cn) 去除了store参数以及以对应的处理方法
     * 3. 2014.06.03 adam(linyue@live.cn) syncHandleWidths方法增加isOnlyHeadHeight参数，用于动态控制分割线的高度
     * 4. 2014.06.03 adam(linyue@live.cn) 将外联样式改成内联样式（只有两个样式，无需外联）
     */

    return function(jquery){

        /* jQuery Resizable Columns v0.1.0 | http://dobtco.github.io/jquery-resizable-columns/ | Licensed MIT | Built Wed Apr 30 2014 14:24:25 */
        var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
          __slice = [].slice;

        (function($, window) {
          var ResizableColumns, parseWidth, pointerX, setWidth;
          parseWidth = function(node) {
            return parseFloat(node.style.width.replace('%', ''));
          };
          setWidth = function(node, width) {
            width = width.toFixed(2);
            return node.style.width = "" + width + "%";
          };
          pointerX = function(e) {
            if (e.type.indexOf('touch') === 0) {
              return (e.originalEvent.touches[0] || e.originalEvent.changedTouches[0]).pageX;
            }
            return e.pageX;
          };
          ResizableColumns = (function() {
            ResizableColumns.prototype.defaults = {
              selector: 'tr th:visible',
              syncHandlers: true,
              resizeFromBody: true,
              maxWidth: null,
              minWidth: null
            };

            function ResizableColumns($table, options) {
              this.pointerdown = __bind(this.pointerdown, this);
              this.constrainWidth = __bind(this.constrainWidth, this);
              this.options = $.extend({}, this.defaults, options);
              this.$table = $table;
              this.setHeaders();
              this.syncHandleWidths(true);
              $(window).on('resize.rc', ((function(_this) {
                return function() {
                  return _this.syncHandleWidths(true);
                };
              })(this)));
              if (this.options.start) {
                this.$table.bind('column:resize:start.rc', this.options.start);
              }
              if (this.options.resize) {
                this.$table.bind('column:resize.rc', this.options.resize);
              }
              if (this.options.stop) {
                this.$table.bind('column:resize:stop.rc', this.options.stop);
              }
            }

            ResizableColumns.prototype.triggerEvent = function(type, args, original) {
              var event;
              event = $.Event(type);
              event.originalEvent = $.extend({}, original);
              return this.$table.trigger(event, [this].concat(args || []));
            };

            ResizableColumns.prototype.getColumnId = function($el) {
              return this.$table.data('resizable-columns-id') + '-' + $el.data('resizable-column-id');
            };

            ResizableColumns.prototype.setHeaders = function() {
              this.$tableHeaders = this.$table.find(this.options.selector);
              this.assignPercentageWidths();
              return this.createHandles();
            };

            ResizableColumns.prototype.destroy = function() {
              this.$handleContainer.remove();
              this.$table.removeData('resizableColumns');
              return this.$table.add(window).off('.rc');
            };

            ResizableColumns.prototype.assignPercentageWidths = function() {
              return this.$tableHeaders.each((function(_this) {
                return function(_, el) {
                  var $el;
                  $el = $(el);
                  return setWidth($el[0], $el.outerWidth() / _this.$table.width() * 100);
                };
              })(this));
            };

            ResizableColumns.prototype.createHandles = function() {
              var _ref;
              if ((_ref = this.$handleContainer) != null) {
                _ref.remove();
              }
              this.$table.before((this.$handleContainer = $("<div class='rc-handle-container' />").css({
                  position: 'absolute'
              })));
              this.$tableHeaders.each((function(_this) {
                return function(i, el) {
                  var $handle;
                  if (_this.$tableHeaders.eq(i + 1).length === 0 || (_this.$tableHeaders.eq(i).attr('data-noresize') != null) || (_this.$tableHeaders.eq(i + 1).attr('data-noresize') != null)) {
                    return;
                  }
                  $handle = $("<div class='rc-handle' />").css({
                        position: 'absolute',
                        width: 7,
                        cursor: 'ew-resize',
                        marginLeft: '-3px',
                        zIndex: 2,
                        borderLeft: '1px dotted #ccc'
                  });
                  $handle.data('th', $(el));
                  return $handle.appendTo(_this.$handleContainer);
                };
              })(this));
              return this.$handleContainer.on('mousedown touchstart', '.rc-handle', this.pointerdown);
            };

            ResizableColumns.prototype.syncHandleWidths = function(isOnlyHeadHeight) {
              return this.$handleContainer.width(this.$table.width()).find('.rc-handle').each((function(_this) {
                return function(_, el) {
                  var $el;
                  $el = $(el);
                  return $el.css({
                    left: $el.data('th').outerWidth() + ($el.data('th').offset().left - _this.$handleContainer.offset().left),
                    height: _this.options.resizeFromBody && !isOnlyHeadHeight ? _this.$table.height() : _this.$table.find('thead').height()
                  });
                };
              })(this));
            };

            ResizableColumns.prototype.totalColumnWidths = function() {
              var total;
              total = 0;
              this.$tableHeaders.each((function(_this) {
                return function(_, el) {
                  return total += parseFloat($(el)[0].style.width.replace('%', ''));
                };
              })(this));
              return total;
            };

            ResizableColumns.prototype.constrainWidth = function(width) {
              if (this.options.minWidth != null) {
                width = Math.max(this.options.minWidth, width);
              }
              if (this.options.maxWidth != null) {
                width = Math.min(this.options.maxWidth, width);
              }
              return width;
            };

            ResizableColumns.prototype.pointerdown = function(e) {
              var $currentGrip, $leftColumn, $ownerDocument, $rightColumn, newWidths, startPosition, widths;
              e.preventDefault();
              $ownerDocument = $(e.currentTarget.ownerDocument);
              startPosition = pointerX(e);
              $currentGrip = $(e.currentTarget);
              $leftColumn = $currentGrip.data('th');
              $rightColumn = this.$tableHeaders.eq(this.$tableHeaders.index($leftColumn) + 1);
              widths = {
                left: parseWidth($leftColumn[0]),
                right: parseWidth($rightColumn[0])
              };
              newWidths = {
                left: widths.left,
                right: widths.right
              };
              this.$handleContainer.add(this.$table).addClass('rc-table-resizing');
              $leftColumn.add($rightColumn).add($currentGrip).addClass('rc-column-resizing');
              this.triggerEvent('column:resize:start', [$leftColumn, $rightColumn, newWidths.left, newWidths.right], e);
              $ownerDocument.on('mousemove.rc touchmove.rc', (function(_this) {
                return function(e) {
                  var difference;
                  difference = (pointerX(e) - startPosition) / _this.$table.width() * 100;
                  setWidth($leftColumn[0], newWidths.left = _this.constrainWidth(widths.left + difference));
                  setWidth($rightColumn[0], newWidths.right = _this.constrainWidth(widths.right - difference));
                  if (_this.options.syncHandlers != null) {
                    _this.syncHandleWidths(false);
                  }
                  return _this.triggerEvent('column:resize', [$leftColumn, $rightColumn, newWidths.left, newWidths.right], e);
                };
              })(this));
              return $ownerDocument.one('mouseup touchend', (function(_this) {
                return function() {
                  $ownerDocument.off('mousemove.rc touchmove.rc');
                  _this.$handleContainer.add(_this.$table).removeClass('rc-table-resizing');
                  $leftColumn.add($rightColumn).add($currentGrip).removeClass('rc-column-resizing');
                  _this.syncHandleWidths(true);
                  return _this.triggerEvent('column:resize:stop', [$leftColumn, $rightColumn, newWidths.left, newWidths.right], e);
                };
              })(this));
            };

            return ResizableColumns;

          })();
          return $.fn.extend({
            resizableColumns: function() {
              var args, option;
              option = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
              return this.each(function() {
                var $table, data;
                $table = $(this);
                data = $table.data('resizableColumns');
                if (!data) {
                  $table.data('resizableColumns', (data = new ResizableColumns($table, option)));
                }
                if (typeof option === 'string') {
                  return data[option].apply(data, args);
                }
              });
            }
          });
        })(window.jQuery, window);
    }
})
