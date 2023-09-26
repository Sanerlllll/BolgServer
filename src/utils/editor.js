import '@toast-ui/editor/dist/toastui-editor.css';
// import 'codemirror/lib/codemirror.css'; 
import { Editor } from '@toast-ui/vue-editor';//此editor为组件形式
// import "@toast-ui/editor/dist/i18n/zh-cn";
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import tableMergedCell from '@toast-ui/editor-plugin-table-merged-cell';
import uml from '@toast-ui/editor-plugin-uml';
import chart from '@toast-ui/editor-plugin-chart';
this.editor = new Editor({
    el: document.querySelector('#editorSection'),
    initialEditType: 'markdown',
    previewStyle: 'vertical',
    height: '100%',
    language:'zh-CN',
    plugins: [chart,codeSyntaxHighlight, colorSyntax, tableMergedCell, uml]
});
