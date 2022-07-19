<template>
    <div>
        <script id="ueid" type="text/plain"></script>
    </div>
</template>
<script>
export default {
    name: 'UE',
    data () {
        return {
            editor: null
        }
    },
    props: {
        defaultMsg: {
            type: String
        },
        config: {
            type: Object
        },
    },
    mounted() {
        const _this = this;
        this.editor = window.UE.getEditor("ueid", this.config); // 初始化UE
        this.editor.addListener("ready", function () {
            setTimeout(function() {
                _this.editor.setContent(_this.defaultMsg); // 确保UE加载完成后，放入内容。
            })
        
        });
    },
    methods: {
        getUEContent() { // 获取内容方法
            return this.editor.getContent()
        },
        setDisabled(){// 设置不可编辑
            return this.editor.setDisabled();
        },
    },
    destroyed() {
        this.editor.destroy();
        }
    }
</script>