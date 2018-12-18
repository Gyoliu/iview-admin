<template>
  <div>
    <Card>
      <div class="search-con search-con-top">
        <Select v-model="queryVo.searchKey" class="search-col">
          <Option v-for="item in columns" v-if="item.key !== 'handle' && item.key !== 'action' && item.filter" :value="item.key" :key="`search-col-${item.key}`">{{ item.title }}</Option>
        </Select>
        <Input @on-change="handleClear" @keyup.enter.native="handleSearch" clearable placeholder="输入关键字搜索" class="search-input" v-model="queryVo.searchValue"/>
        <Button @click="handleSearch" @keyup.enter.native="handleSearch" class="search-btn" type="primary"><Icon type="search"/>&nbsp;&nbsp;搜索</Button>
      </div>

      <tables ref="tables" disabled-hover highlight-row :loading="loading" search-place="top" v-model="tableData"
              :columns="columns" @on-delete="handleDelete"/>
    </Card>
  </div>
</template>

<style>
  .ivu-poptip-confirm .ivu-poptip-body .ivu-icon {
    margin-left: -60px;
  }
</style>

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
      queryVo: {
        searchKey: '',
        searchValue: ''
      },
      columns: [
        { title: '登入名称', key: 'username', filter: true },
        {
          title: '用户名称',
          key: 'firstName',
          filter: true,
          render: (h, params) => {
            return h('div', params.row.userInfo.firstName)
          }
        },
        {
          title: '联系电话',
          key: 'phoneNumber',
          filter: true,
          render: (h, params) => {
            return h('div', params.row.userInfo.phoneNumber)
          }
        },
        {
          title: '邮箱',
          key: 'email',
          filter: true,
          render: (h, params) => {
            return h('div', params.row.userInfo.email)
          }
        },
        {
          title: '账号是否开启',
          key: 'enable',
          filter: true,
          render: (h, params) => {
            return h('tag', {
              props: {
                value: params.row.enable,
                color: params.row.enable ? 'primary' : 'error'
              },
              on: {
                change: () => {
                  this.show(params.index)
                }
              }
            }, params.row.enable ? [h('Span', '开启')] : [h('Span', '关闭')])
          }
        },
        {
          title: '账号是否锁定',
          key: 'locking',
          filter: true,
          render: (h, params) => {
            return h('tag', {
              props: {
                value: params.row.locking,
                color: params.row.locking ? 'error' : 'primary'
              },
              on: {
                change: () => {
                  this.show(params.index)
                }
              }
            }, params.row.locking ? [h('Span', '已锁定')] : [h('Span', '未锁定')])
          }
        },
        {
          title: 'Action',
          key: 'action',
          filter: false,
          // width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', {}, [
              h('Poptip', {
                props: {
                  confirm: true,
                  title: '你确定要删除吗?'
                },
                on: {
                  'on-ok': () => {
                    this.handleDelete(params)
                    // vm.$emit('on-delete', params)
                    // vm.$emit('input', params.tableData.filter((item, index) => index !== params.row.initRowIndex))
                  }
                }
              }, [h('Button', { props: { icon: 'md-trash' } })]),
              h('ButtonGroup', {}, [
                h('Button', { props: { icon: 'md-eye' } }),
                h('Button', { props: { icon: 'md-brush' } })
              ])
            ])
          }
        }
      ],
      tableData: []
    }
  },
  methods: {
    handleDelete (params) {
      this.tableData = this.tableData.filter((item, index) => index !== params.row.initRowIndex)
    },
    handleSearch () {
      if (this.queryVo.searchKey === '') {
        return
      }
      this.getTableData(this.queryVo)
    },
    handleClear () {
    },
    getTableData (param) {
      this.loading = true
      getUserOnlineData(param).then(res => {
        this.tableData = res.data.data
        this.loading = false
      })
    }
  },
  mounted () {
    this.getTableData({})
  }
}
</script>

<style scoped>

</style>
