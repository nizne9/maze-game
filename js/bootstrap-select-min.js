; !function (b) {
    b.expr[":"].icontains = function (e, c, d) {
        return b(e).text().toUpperCase().indexOf(d[3].toUpperCase()) >= 0
    }
        ;
    var a = function (d, c, f) {
        if (f) {
            f.stopPropagation();
            f.preventDefault()
        }
        this.$element = b(d);
        this.$newElement = null;
        this.$button = null;
        this.$menu = null;
        this.options = b.extend({}, b.fn.selectpicker.defaults, this.$element.data(), typeof c == "object" && c);
        if (this.options.title == null) {
            this.options.title = this.$element.attr("title")
        }
        this.val = a.prototype.val;
        this.render = a.prototype.render;
        this.refresh = a.prototype.refresh;
        this.setStyle = a.prototype.setStyle;
        this.selectAll = a.prototype.selectAll;
        this.deselectAll = a.prototype.deselectAll;
        this.init()
    };
    a.prototype = {
        constructor: a,
        init: function (d) {
            this.$element.hide();
            this.multiple = this.$element.prop("multiple");
            var f = this.$element.attr("id");
            this.$newElement = this.createView();
            this.$element.after(this.$newElement);
            this.$menu = this.$newElement.find("> .dropdown-menu");
            this.$button = this.$newElement.find("> button");
            this.$searchbox = this.$newElement.find("input");
            if (f !== undefined) {
                var c = this;
                this.$button.attr("data-id", f);
                b('label[for="' + f + '"]').click(function (g) {
                    g.preventDefault();
                    c.$button.focus()
                })
            }
            this.checkDisabled();
            this.clickListener();
            this.liveSearchListener();
            this.render();
            this.liHeight();
            this.setStyle();
            this.setWidth();
            if (this.options.container) {
                this.selectPosition()
            }
            this.$menu.data("this", this);
            this.$newElement.data("this", this)
        },
        createDropdown: function () {
            var c = this.multiple ? " show-tick" : "";
            var f = this.options.header ? '<div class="popover-title"><button type="button" class="close" aria-hidden="true">&times;</button>' + this.options.header + "</div>" : "";
            var e = this.options.liveSearch ? '<div class="bootstrap-select-searchbox"><input type="text" class="input-block-level form-control" /></div>' : "";
            var d = "<div class='btn-group bootstrap-select" + c + "'><button type='button' class='btn dropdown-toggle' data-toggle='dropdown'><div class='filter-option pull-left'></div>&nbsp;<div class='caret'></div></button><div class='dropdown-menu open'>" + f + e + "<ul class='dropdown-menu inner' role='menu'></ul></div></div>";
            return b(d)
        },
        createView: function () {
            var c = this.createDropdown();
            var d = this.createLi();
            c.find("ul").append(d);
            return c
        },
        reloadLi: function () {
            this.destroyLi();
            var c = this.createLi();
            this.$menu.find("ul").append(c)
        },
        destroyLi: function () {
            this.$menu.find("li").remove()
        },
        createLi: function () {
            var d = this
                , e = []
                , c = "";
            this.$element.find("option").each(function (h) {
                var j = b(this);
                var g = j.attr("class") || "";
                var i = j.attr("style") || "";
                var n = j.data("content") ? j.data("content") : j.html();
                var l = j.data("subtext") !== undefined ? '<small class="muted text-muted">' + j.data("subtext") + "</small>" : "";
                var k = j.data("icon") !== undefined ? '<i class="glyphicon ' + j.data("icon") + '"></i> ' : "";
                if (k !== "" && (j.is(":disabled") || j.parent().is(":disabled"))) {
                    k = "<span>" + k + "</span>"
                }
                if (!j.data("content")) {
                    n = k + '<span class="text">' + n + l + "</span>"
                }
                if (d.options.hideDisabled && (j.is(":disabled") || j.parent().is(":disabled"))) {
                    e.push('<a style="min-height: 0; padding: 0"></a>')
                } else {
                    if (j.parent().is("optgroup") && j.data("divider") != true) {
                        if (j.index() == 0) {
                            var m = j.parent().attr("label");
                            var o = j.parent().data("subtext") !== undefined ? '<small class="muted text-muted">' + j.parent().data("subtext") + "</small>" : "";
                            var f = j.parent().data("icon") ? '<i class="' + j.parent().data("icon") + '"></i> ' : "";
                            m = f + '<span class="text">' + m + o + "</span>";
                            if (j[0].index != 0) {
                                e.push('<div class="div-contain"><div class="divider"></div></div><dt>' + m + "</dt>" + d.createA(n, "opt " + g, i))
                            } else {
                                e.push("<dt>" + m + "</dt>" + d.createA(n, "opt " + g, i))
                            }
                        } else {
                            e.push(d.createA(n, "opt " + g, i))
                        }
                    } else {
                        if (j.data("divider") == true) {
                            e.push('<div class="div-contain"><div class="divider"></div></div>')
                        } else {
                            if (b(this).data("hidden") == true) {
                                e.push("")
                            } else {
                                e.push(d.createA(n, g, i))
                            }
                        }
                    }
                }
            });
            b.each(e, function (f, g) {
                c += "<li rel=" + f + ">" + g + "</li>"
            });
            if (!this.multiple && this.$element.find("option:selected").length == 0 && !this.options.title) {
                this.$element.find("option").eq(0).prop("selected", true).attr("selected", "selected")
            }
            return b(c)
        },
        createA: function (e, c, d) {
            return '<a tabindex="0" class="' + c + '" style="' + d + '">' + e + '<i class="glyphicon glyphicon-ok icon-ok check-mark"></i></a>'
        },
        render: function () {
            var d = this;
            this.$element.find("option").each(function (h) {
                d.setDisabled(h, b(this).is(":disabled") || b(this).parent().is(":disabled"));
                d.setSelected(h, b(this).is(":selected"))
            });
            this.tabIndex();
            var g = this.$element.find("option:selected").map(function (h, k) {
                var l = b(this);
                var j = l.data("icon") && d.options.showIcon ? '<i class="glyphicon ' + l.data("icon") + '"></i> ' : "";
                var i;
                if (d.options.showSubtext && l.attr("data-subtext") && !d.multiple) {
                    i = ' <small class="muted text-muted">' + l.data("subtext") + "</small>"
                } else {
                    i = ""
                }
                if (l.data("content") && d.options.showContent) {
                    return l.data("content")
                } else {
                    if (l.attr("title") != undefined) {
                        return l.attr("title")
                    } else {
                        return j + l.html() + i
                    }
                }
            }).toArray();
            var f = !this.multiple ? g[0] : g.join(", ");
            if (this.multiple && this.options.selectedTextFormat.indexOf("count") > -1) {
                var c = this.options.selectedTextFormat.split(">");
                var e = this.options.hideDisabled ? ":not([disabled])" : "";
                if ((c.length > 1 && g.length > c[1]) || (c.length == 1 && g.length >= 2)) {
                    f = this.options.countSelectedText.replace("{0}", g.length).replace("{1}", this.$element.find('option:not([data-divider="true"]):not([data-hidden="true"])' + e).length)
                }
            }
            if (!f) {
                f = this.options.title != undefined ? this.options.title : this.options.noneSelectedText
            }
            this.$newElement.find(".filter-option").html(f)
        },
        setStyle: function (e, d) {
            if (this.$element.attr("class")) {
                this.$newElement.addClass(this.$element.attr("class").replace(/selectpicker|mobile-device/gi, ""))
            }
            var c = e ? e : this.options.style;
            if (d == "add") {
                this.$button.addClass(c)
            } else {
                if (d == "remove") {
                    this.$button.removeClass(c)
                } else {
                    this.$button.removeClass(this.options.style);
                    this.$button.addClass(c)
                }
            }
        },
        liHeight: function () {
            var f = this.$newElement.clone();
            f.appendTo("body");
            var e = f.addClass("open").find("> .dropdown-menu");
            var d = e.find("li > a").outerHeight();
            var c = this.options.header ? e.find(".popover-title").outerHeight() : 0;
            var g = this.options.liveSearch ? e.find(".bootstrap-select-searchbox").outerHeight() : 0;
            f.remove();
            this.$newElement.data("liHeight", d).data("headerHeight", c).data("searchHeight", g)
        },
        setSize: function () {
            var h = this, d = this.$menu, i = d.find(".inner"), p = i.find("li > a"), u = this.$newElement.outerHeight(), f = this.$newElement.data("liHeight"), s = this.$newElement.data("headerHeight"), l = this.$newElement.data("searchHeight"), k = d.find("li .divider").outerHeight(true), r = parseInt(d.css("padding-top")) + parseInt(d.css("padding-bottom")) + parseInt(d.css("border-top-width")) + parseInt(d.css("border-bottom-width")), o = this.options.hideDisabled ? ":not(.disabled)" : "", n = b(window), g = r + parseInt(d.css("margin-top")) + parseInt(d.css("margin-bottom")) + 2, q, v, t, j = function () {
                v = h.$newElement.offset().top - n.scrollTop();
                t = n.height() - v - u
            };
            j();
            if (this.options.header) {
                d.css("padding-top", 0)
            }
            if (this.options.size == "auto") {
                var e = function () {
                    var w;
                    j();
                    q = t - g;
                    h.$newElement.toggleClass("dropup", (v > t) && (q - g) < d.height() && h.options.dropupAuto);
                    if (h.$newElement.hasClass("dropup")) {
                        q = v - g
                    }
                    if ((d.find("li").length + d.find("dt").length) > 3) {
                        w = f * 3 + g - 2
                    } else {
                        w = 0
                    }
                    d.css({
                        "max-height": q + "px",
                        overflow: "hidden",
                        "min-height": w + "px"
                    });
                    i.css({
                        "max-height": q - s - l - r + "px",
                        "overflow-y": "auto",
                        "min-height": w - r + "px"
                    })
                };
                e();
                b(window).resize(e);
                b(window).scroll(e)
            } else {
                if (this.options.size && this.options.size != "auto" && d.find("li" + o).length > this.options.size) {
                    var m = d.find("li" + o + " > *").filter(":not(.div-contain)").slice(0, this.options.size).last().parent().index();
                    var c = d.find("li").slice(0, m + 1).find(".div-contain").length;
                    q = f * this.options.size + c * k + r;
                    this.$newElement.toggleClass("dropup", (v > t) && q < d.height() && this.options.dropupAuto);
                    d.css({
                        "max-height": q + s + l + "px",
                        overflow: "hidden"
                    });
                    i.css({
                        "max-height": q - r + "px",
                        "overflow-y": "auto"
                    })
                }
            }
        },
        setWidth: function () {
            if (this.options.width == "auto") {
                this.$menu.css("min-width", "0");
                var d = this.$newElement.clone().appendTo("body");
                var c = d.find("> .dropdown-menu").css("width");
                d.remove();
                this.$newElement.css("width", c)
            } else {
                if (this.options.width == "fit") {
                    this.$menu.css("min-width", "");
                    this.$newElement.css("width", "").addClass("fit-width")
                } else {
                    if (this.options.width) {
                        this.$menu.css("min-width", "");
                        this.$newElement.css("width", this.options.width)
                    } else {
                        this.$menu.css("min-width", "");
                        this.$newElement.css("width", "")
                    }
                }
            }
            if (this.$newElement.hasClass("fit-width") && this.options.width !== "fit") {
                this.$newElement.removeClass("fit-width")
            }
        },
        selectPosition: function () {
            var e = this, d = "<div />", f = b(d), h, g, c = function (i) {
                f.addClass(i.attr("class")).toggleClass("dropup", i.hasClass("dropup"));
                h = i.offset();
                g = i.hasClass("dropup") ? 0 : i[0].offsetHeight;
                f.css({
                    top: h.top + g,
                    left: h.left,
                    width: i[0].offsetWidth,
                    position: "absolute"
                })
            };
            this.$newElement.on("click", function (i) {
                c(b(this));
                f.appendTo(e.options.container);
                f.toggleClass("open", !b(this).hasClass("open"));
                f.append(e.$menu)
            });
            b(window).resize(function () {
                c(e.$newElement)
            });
            b(window).on("scroll", function (i) {
                c(e.$newElement)
            });
            b("html").on("click", function (i) {
                if (b(i.target).closest(e.$newElement).length < 1) {
                    f.removeClass("open")
                }
            })
        },
        mobile: function () {
            this.$element.addClass("mobile-device").appendTo(this.$newElement);
            if (this.options.container) {
                this.$menu.hide()
            }
        },
        refresh: function () {
            this.reloadLi();
            this.render();
            this.setWidth();
            this.setStyle();
            this.checkDisabled();
            this.liHeight()
        },
        update: function () {
            this.reloadLi();
            this.setWidth();
            this.setStyle();
            this.checkDisabled();
            this.liHeight()
        },
        setSelected: function (c, d) {
            this.$menu.find("li").eq(c).toggleClass("selected", d)
        },
        setDisabled: function (c, d) {
            if (d) {
                this.$menu.find("li").eq(c).addClass("disabled").find("a").attr("href", "#").attr("tabindex", -1)
            } else {
                this.$menu.find("li").eq(c).removeClass("disabled").find("a").removeAttr("href").attr("tabindex", 0)
            }
        },
        isDisabled: function () {
            return this.$element.is(":disabled")
        },
        checkDisabled: function () {
            var c = this;
            if (this.isDisabled()) {
                this.$button.addClass("disabled").attr("tabindex", -1)
            } else {
                if (this.$button.hasClass("disabled")) {
                    this.$button.removeClass("disabled")
                }
                if (this.$button.attr("tabindex") == -1) {
                    if (!this.$element.data("tabindex")) {
                        this.$button.removeAttr("tabindex")
                    }
                }
            }
            this.$button.click(function () {
                return !c.isDisabled()
            })
        },
        tabIndex: function () {
            if (this.$element.is("[tabindex]")) {
                this.$element.data("tabindex", this.$element.attr("tabindex"));
                this.$button.attr("tabindex", this.$element.data("tabindex"))
            }
        },
        clickListener: function () {
            var c = this;
            b("body").on("touchstart.dropdown", ".dropdown-menu", function (d) {
                d.stopPropagation()
            });
            this.$newElement.on("click", function () {
                c.setSize()
            });
            this.$menu.on("click", "li a", function (k) {
                var f = b(this).parent().index()
                    , j = b(this).parent()
                    , i = c.$element.val();
                if (c.multiple) {
                    k.stopPropagation()
                }
                k.preventDefault();
                if (!c.isDisabled() && !b(this).parent().hasClass("disabled")) {
                    var d = c.$element.find("option");
                    var h = d.eq(f);
                    if (!c.multiple) {
                        d.prop("selected", false);
                        h.prop("selected", true)
                    } else {
                        var g = h.prop("selected");
                        h.prop("selected", !g)
                    }
                    c.$button.focus();
                    if (i != c.$element.val()) {
                        c.$element.change()
                    }
                }
            });
            this.$menu.on("click", "li.disabled a, li dt, li .div-contain, h3.popover-title", function (d) {
                if (d.target == this) {
                    d.preventDefault();
                    d.stopPropagation();
                    c.$button.focus()
                }
            });
            this.$searchbox.on("click", function (d) {
                d.stopPropagation()
            });
            this.$element.change(function () {
                c.render()
            })
        },
        liveSearchListener: function () {
            var c = this;
            this.$newElement.on("click.dropdown.data-api", function (d) {
                if (c.options.liveSearch) {
                    setTimeout(function () {
                        c.$searchbox.focus()
                    }, 10)
                }
            });
            this.$searchbox.on("input", function () {
                if (c.$searchbox.val()) {
                    c.$menu.find("li").show().not(":icontains(" + c.$searchbox.val() + ")").hide()
                } else {
                    c.$menu.find("li").show()
                }
            })
        },
        val: function (c) {
            if (c != undefined) {
                this.$element.val(c);
                this.$element.change();
                return this.$element
            } else {
                return this.$element.val()
            }
        },
        selectAll: function () {
            this.$element.find("option").prop("selected", true).attr("selected", "selected");
            this.render()
        },
        deselectAll: function () {
            this.$element.find("option").prop("selected", false).removeAttr("selected");
            this.render()
        },
        keydown: function (o) {
            var p, n, h, m, j, i, q, d, g, l;
            p = b(this);
            h = p.parent();
            l = h.data("this");
            if (l.options.container) {
                h = l.$menu
            }
            n = b("[role=menu] li:not(.divider):visible a", h);
            if (!n.length) {
                return
            }
            if (/(38|40)/.test(o.keyCode)) {
                m = n.index(n.filter(":focus"));
                i = n.parent(":not(.disabled)").first().index();
                q = n.parent(":not(.disabled)").last().index();
                j = n.eq(m).parent().nextAll(":not(.disabled)").eq(0).index();
                d = n.eq(m).parent().prevAll(":not(.disabled)").eq(0).index();
                g = n.eq(j).parent().prevAll(":not(.disabled)").eq(0).index();
                if (o.keyCode == 38) {
                    if (m != g && m > d) {
                        m = d
                    }
                    if (m < i) {
                        m = i
                    }
                }
                if (o.keyCode == 40) {
                    if (m != g && m < j) {
                        m = j
                    }
                    if (m > q) {
                        m = q
                    }
                    if (m == -1) {
                        m = 0
                    }
                }
                n.eq(m).focus()
            } else {
                var f = {
                    48: "0",
                    49: "1",
                    50: "2",
                    51: "3",
                    52: "4",
                    53: "5",
                    54: "6",
                    55: "7",
                    56: "8",
                    57: "9",
                    59: ";",
                    65: "a",
                    66: "b",
                    67: "c",
                    68: "d",
                    69: "e",
                    70: "f",
                    71: "g",
                    72: "h",
                    73: "i",
                    74: "j",
                    75: "k",
                    76: "l",
                    77: "m",
                    78: "n",
                    79: "o",
                    80: "p",
                    81: "q",
                    82: "r",
                    83: "s",
                    84: "t",
                    85: "u",
                    86: "v",
                    87: "w",
                    88: "x",
                    89: "y",
                    90: "z",
                    96: "0",
                    97: "1",
                    98: "2",
                    99: "3",
                    100: "4",
                    101: "5",
                    102: "6",
                    103: "7",
                    104: "8",
                    105: "9"
                };
                var c = [];
                n.each(function () {
                    if (b(this).parent().is(":not(.disabled)")) {
                        if (b.trim(b(this).text().toLowerCase()).substring(0, 1) == f[o.keyCode]) {
                            c.push(b(this).parent().index())
                        }
                    }
                });
                var k = b(document).data("keycount");
                k++;
                b(document).data("keycount", k);
                var r = b.trim(b(":focus").text().toLowerCase()).substring(0, 1);
                if (r != f[o.keyCode]) {
                    k = 1;
                    b(document).data("keycount", k)
                } else {
                    if (k >= c.length) {
                        b(document).data("keycount", 0)
                    }
                }
                n.eq(c[k - 1]).focus()
            }
            if (/(13|32)/.test(o.keyCode)) {
                o.preventDefault();
                b(":focus").click();
                b(document).data("keycount", 0)
            }
        },
        hide: function () {
            this.$newElement.hide()
        },
        show: function () {
            this.$newElement.show()
        },
        destroy: function () {
            this.$newElement.remove();
            this.$element.remove()
        }
    };
    b.fn.selectpicker = function (e, f) {
        var c = arguments;
        var g;
        var d = this.each(function () {
            if (b(this).is("select")) {
                var m = b(this)
                    , l = m.data("selectpicker")
                    , h = typeof e == "object" && e;
                if (!l) {
                    m.data("selectpicker", (l = new a(this, h, f)))
                } else {
                    if (h) {
                        for (var j in h) {
                            l.options[j] = h[j]
                        }
                    }
                }
                if (typeof e == "string") {
                    var k = e;
                    if (l[k] instanceof Function) {
                        [].shift.apply(c);
                        g = l[k].apply(l, c)
                    } else {
                        g = l.options[k]
                    }
                }
            }
        });
        if (g != undefined) {
            return g
        } else {
            return d
        }
    }
        ;
    b.fn.selectpicker.defaults = {
        style: "btn-default",
        size: "auto",
        title: null,
        selectedTextFormat: "values",
        noneSelectedText: "Nothing selected",
        countSelectedText: "{0} of {1} selected",
        width: false,
        container: false,
        hideDisabled: false,
        showSubtext: false,
        showIcon: true,
        showContent: true,
        dropupAuto: true,
        header: false,
        liveSearch: false
    };
    b(document).data("keycount", 0).on("keydown", "[data-toggle=dropdown], [role=menu]", a.prototype.keydown)
}(window.jQuery);
