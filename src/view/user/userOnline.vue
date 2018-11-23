<template>
  <div>
    <Card>
      <tables ref="tables" editable searchable disabled-hover highlight-row :loading="loading" search-place="top" v-model="tableData"
              :columns="columns" @on-delete="handleDelete"/>
    </Card>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getUserOnlineData } from '@/api/user'

export default {
  name: 'userOnline',
  components: {
    Tables
  },
  data () {
    return {
      loading: false,
      columns: [
        {title: 'LoginName', key: 'username'},
        {
          title: 'Username',
          key: 'userInfo.firstName',
          render: (h, params) => {
            console.log(h)
            return h('div', params.row.userInfo.firstName)
          }
        },
        {
          title: 'Enable',
          key: 'enable',
          render: (h, params) => {
            console.log(params)
            return h('Switch', [h('Span', '开'), h('Span', '关')])
          }
        },
        {
          title: 'Handle',
          key: 'handle',
          options: ['delete'],
          button: [
            (h, params, vm) => {
              return h('Poptip', {
                props: {
                  confirm: true,
                  title: '你确定要删除吗?'
                },
                on: {
                  'on-ok': () => {
                    vm.$emit('on-delete', params)
                    vm.$emit('input', params.tableData.filter((item, index) => index !== params.row.initRowIndex))
                  }
                }
              }, [
                h('Button', '自定义删除')
              ])
            }
          ]
        }
      ],
      tableData: []
    }
  },
  methods: {
    handleDelete (params) {
      console.log(params)
    }
  },
  mounted () {
    this.loading = true
    getUserOnlineData().then(res => {
      this.tableData = res.data.data
      this.loading = false
    })
  }
}
</script>

<style scoped>

</style>
