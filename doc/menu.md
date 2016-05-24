# 如何使用Menu

## 菜单定义

在 `settings.ini` 中定义父菜单:

```
[MENUS]
SIDEMENU = {}

[MENUS_CONFIG]
sidemenu = 'SIDEMENU'
```

对于 `MENUS_CONFIG` 其实可以考虑省略,它会用在 `uliweb_menu` 中的 `inc_sidemenu.html` 中,代码为:

```
{{<< functions.menu(settings.MENUS_CONFIG.sidemenu)}}
```

这段代码其实会用在 `inc_sidebar.html` 中,为:

```
{{block sidebar}}
<aside class="main-sidebar">
    <section class="sidebar">
        {{block sidemenu}}
            {{include "layout/include/inc_sidemenu.html"}}
        {{end}}
        {{if settings.MENUS_CONFIG.pjax:}}
        <script>
          require(['pjax'], function(){
            $(document).pjax('.sidebar-menu a', '.content-wrapper');
          });
        </script>
        {{pass}}
    </section>
</aside>
{{end}}
```

在 `block sidemenu` 中被引用.但是缺省的使用并不会激活当前的菜单项,所以我们一般要在自已APP中的
layout中重写 `sidemenu`,如:

```
{{block sidemenu}}
{{<< functions.menu('SIDEMENU', active='{}'.format(page_name))}}
{{end}}
```

这里就没有使用 `settings.MENUS_CONFIG.sidemenu` ,所以说 `MENUS_CONFIG.sidemenu` 不是必需的.
只是为了省事的一种定义.

要注意 `sidemenu` 是在 `2column_sidebar.html` 中定义的,所以你最终要从这个模板继承,当然,如果你的
模板中也定义了 `sidemenu` 也是可以的.

`menu` 是 `uliweb_menu` 模块中定义的公共函数(它是从plugs.menus中移植过来,但是又针对AdminLTE做了改造).
它有一个 `active` 的参数,是以 `/` 分隔的菜单名的多级路径,用来表示当前活动的菜单项.