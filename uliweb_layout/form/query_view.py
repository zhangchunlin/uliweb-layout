#coding=utf8
# 用于定义查询条件
# 主要分为:
#   QueryView 只用来生成查询Form及校验,不与Model, Table相关联
#   TableQueryView 根据Table来生成QueryView
#   ModelQueryView 根据Model来生成QueryView

from uliweb.i18n import gettext_lazy as _
from uliweb.form import *

class QueryViewError(Exception):pass

class QueryView(object):
    def __init__(self, data=None, fields=None,
                form_cls=None,
                form_args=None,
                post_created_form=None,
                layout=None, get_form_field=None):

        self.data = data or {}
        self.get_form_field = get_form_field
        self.result = {}

        self.form = None
        self.fields = self.get_fields(fields)
        self.form_cls = form_cls
        self.form_args = form_args or {}
        self.post_created_form = post_created_form

        #add layout support
        self.layout = layout
        self.make_form()

    def get_fields(self, fields):
        s = []
        for f in fields:
            if isinstance(f, (tuple, list)) and isinstance(f[1], BaseField):
                f[1].name = f[0]
                d = f[1].to_json()
                s.append(d)
            elif isinstance(f, dict):
                s.append(f)
            else:
                raise QueryViewError("Form field data format {!r} is not support, should"
                                    "be ('name', Field) or {}".format(f))
        self.fields = s
        return self.fields

    def get_layout(self):
        if self.layout:
            return self.layout

        layout = []
        for x in self.fields:
            if isinstance(x, str):
                layout.append(x)
            elif isinstance(x, (tuple, list)):
                layout.append(x[0])
            else:
                layout.append(x['name'])
        self.layout = [tuple(layout)]
        return self.layout

    def make_form(self):
        import uliweb.form as form

        if self.form_cls:
            class DummyForm(self.form_cls):
                pass
        else:
            class DummyForm(form.Form):
                pass

        #add layout support
        layout = self.get_layout()
        DummyForm.layout = layout

        for f in self.fields:
            flag = False
            if self.get_form_field:
                field = self.get_form_field(f['name'])
                if field:
                    flag = True
            if not flag:
                #maybe format is ('name', Field)
                if isinstance(f, (tuple, list)):
                    field = f[1]
                    f = {'name':f[0]}
                elif isinstance(f, dict):
                    field = make_field(**f)
                else:
                    raise QueryViewError("Form field data format {!r} is not support, should"
                                    "be ('name', Field) or {}".format(f))
            if field:
                DummyForm.add_field(f['name'], field, True)

        if self.post_created_form:
            self.post_created_form(DummyForm)

        form = DummyForm(data=self.data, **self.form_args)
        return form

    def run(self):
        from uliweb import request

        if not self.form:
            self.form = self.make_form()

        flag = self.form.validate(request.values)
        if flag:
            if self.data:
                for k, v in self.data.items():
                    if not self.form.data.get(k):
                        self.form.data[k] = v
            self.result = self.form.data.copy()
        else:
            self.result = self.form.data
        return self.result


    def get_json(self):
        return {
            'fields':self.fields,
            'layout':self.get_layout(),
            'data':self.result or self.data,
            'rules':self.form.front_rules['rules'],
            'messages':self.form.front_rules['messages'],
        }