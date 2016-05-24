__version__ = '1.0'
__url__ = ''
__author__ = 'limodou'
__email__ = 'limodou@gmail.com'

from cStringIO import StringIO
from uliweb.utils.common import safe_str


class Layout3Utils(object):
    def theme(self):
        return get_current_theme()

    def submenu(self, menus, *actives):
        return self.left_side_menu(menus, True, 1, *actives)

    def uliweb_layout_sidebar_menu(self, menus, *actives):
        return self.left_side_menu_new(menus, True, 1, *actives)

    def left_side_menu_new(self, menu_items, is_folder, level, *actives):
        if len(actives) > 0:
            active = actives[0]
            items = actives[1:]
        else:
            active = None
            items = ()
        out = StringIO()
        if is_folder:
            out.write("<ul class='sidebar-menu'>")
        else:
            out.write("<ul class='treeview-menu'>")
        for x in menu_items:
            if active == x['name']:
                li_class = "active"
            else:
                li_class = ""
            if is_folder:
                li_class = "treeview " + li_class
                sub_icon = "<i class=\"fa fa-link\"></i>"
            else:
                sub_icon = ""
            if x.get('subs', None):
                link = "#"
                target = '_self'
                out.write(
                    '<li class=\"%s\"><a href=\"%s\" target=\"%s\">%s<span>%s</span><i class=\"fa fa-angle-left pull-right\"></i></a>' % (
                    li_class, link, target,sub_icon, x["title"]))
            else:
                link = x.get("link", "#")
                target = x.get('target', '_self')
                out.write(
                    '<li class=\"%s\"><a href=\"%s\" target=\"%s\">%s<span>%s</span></a>' % (
                    li_class, link, target,sub_icon, x["title"]))

            if x.get('subs', None):
                out.write(self.left_side_menu_new(x['subs'], False, level + 1, *items))
            out.write("</li>")
        out.write("</ul>")
        return out.getvalue()

    def left_side_menu(self, menu_items, is_folder, level, *actives):
        from uliweb import request, functions, settings

        if len(actives) > 0:
            first = actives[0]
            items = actives[1:]
        else:
            first = None
            items = ()
        out = StringIO()
        out.write('<ul class="simplemenu noaccordion level%s">' % level)
        for x in menu_items:
            if x['name'] == first:
                if not items:
                    attr = ' class="active"'
                else:
                    attr = ''
                if is_folder:
                    li_attr = ' class="expand isfolder"'
                else:
                    li_attr = ' class="expand ismenu"'
                if x.get('subs', None):
                    _class = ' ui-icon-blank'
                    link = x.get('link', "#")
                    target = x.get('target', '_self')
                span = '<span class="ui-icon%s"></span>' % _class
            else:
                attr = ""
                if is_folder:
                    li_attr = ' class="isfolder"'
                else:
                    li_attr = ' class="ismenu"'
                if x.get('subs', None):
                    _class = ' ui-icon-taiangle-1-e'
                    link = '#'
                    target = '_self'
                else:
                    _class = ' ui-icon-blank'
                    link = x.get('link', '#')
                    target = x.get('target', '_self')
                span = '<span class="ui-icon%s"></span>' % _class
            out.write(
                '<li%s><a href="%s"%s target="%s">%s%s</a>' % (li_attr, link, attr, target, span, safe_str(x['title'])))
            if x.get('subs', None):
                out.write(self.left_side_menu(x['subs'], False, level + 1, *items))
            out.write('</li>')
        out.write('</ul>')
        return out.getvalue()


def get_layout3_utils():
    utils = Layout3Utils()
    return utils


def get_layout_utils():
    utils = Layout3Utils()
    return utils


def get_current_theme():
    from uliweb import settings

    return settings.THEME.CURR_THEME
