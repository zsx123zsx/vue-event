<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix header-box">
        <span>文章分类</span>
        <el-button type="primary" size="mini" @click="addCateShowFn"
          >添加分类</el-button
        >
      </div>
      <!--  -->
      <el-table :data="cateList" style="width: 100%" border stripe>
        <el-table-column
          type="index"
          label="序号"
          width="100"
        ></el-table-column>
        <el-table-column prop="cate_name" label="分类名称"></el-table-column>
        <el-table-column prop="cate_alias" label="分类别名"></el-table-column>
        <el-table-column label="操作">
          <!--  scope对象：{ row:行对象} -->
          <template v-slot="scope">
            <el-button
              type="primary"
              size="mini"
              @click="updateCateBtnFn(scope.row)"
              >修改</el-button
            >
            <el-button type="danger" size="mini" @click="delCateFn(scope.row)"
              >删除</el-button
            ></template
          >
        </el-table-column>
      </el-table>
      <!-- 添加分类的对话框 -->
      <el-dialog
        title="添加文章分类"
        :visible.sync="addVisible"
        width="35%"
        @close="dialogCloseFn"
      >
        <!-- 添加的表单 -->
        <el-form
          :model="addForm"
          :rules="addRules"
          ref="addRef"
          label-width="80px"
        >
          <el-form-item label="分类名称" prop="cate_name">
            <el-input
              v-model="addForm.cate_name"
              minlength="1"
              maxlength="10"
            ></el-input>
          </el-form-item>
          <el-form-item label="分类别名" prop="cate_alias">
            <el-input
              v-model="addForm.cate_alias"
              minlength="1"
              maxlength="15"
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="cancelFn">取 消</el-button>
          <el-button size="mini" type="primary" @click="addFn">添 加</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import {
  delArtCateAPI,
  getArtCateListAPI,
  saveArtCateAPI,
  updaeArtCateAPI,
} from '@/api'
// import { saveArtCateAPI } from '@/api'
export default {
  name: 'ArtCate',
  data() {
    return {
      cateList: [], // 文章分类数组
      addVisible: false, // 添加分类-对话框是否显示
      addForm: {
        // 添加表单的数据对象
        cate_name: '',
        cate_alias: '',
      },
      addRules: {
        // 添加表单的验证规则对象
        cate_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          {
            pattern: /^\S{1,10}$/,
            message: '分类名必须是1-10位的非空字符',
            trigger: 'blur',
          },
        ],
        cate_alias: [
          { required: true, message: '请输入分类别名', trigger: 'blur' },
          {
            pattern: /^[a-zA-Z0-9]{1,15}$/,
            message: '分类别名必须是1-15位的字母数字',
            trigger: 'blur',
          },
        ],
      },
      isEdit: false, // true为变价状态，false新增状态
      editId: '', // 保存在在要编辑的数据id值
    }
  },
  created() {
    // 获取-文章分类列表
    this.getArtCateListFn()
  },
  methods: {
    // 获取-文章列表
    async getArtCateListFn() {
      const res = await getArtCateListAPI()
      console.log(res)
      this.cateList = res.data.data
    },
    //   添加分类按钮点击事件-，为让对话框出现
    addCateShowFn() {
      this.isEdit = false // 变回新增状态标志
      this.editId = ''
      this.addVisible = true
    },
    // 对话框内-添加按钮-点击事件
    addFn() {
      this.$refs.addRef.validate(async (valid) => {
        if (valid) {
          // 通过校验
          if (this.isEdit) {
            // 要修改
            // this.addForm.id = this.editId  // 把要编辑的文章分类id添加到对象上
            //  updaeArtCateAPI(this.addForm)
            const { data: res } = await updaeArtCateAPI({
              id: this.editId,
              ...this.addForm,
            })
            if (res.code !== 0) return this.$message.error(res.message)
            this.$message.success(res.message)
          } else {
            // 要新增
            const { data: res } = await saveArtCateAPI(this.addForm)
            // console.log(res)
            if (res.code !== 0) return this.$message.error(res.message)
            this.$message.success(res.message)
          }

          // 再重新请求一次文章列表，拿到最新数据，让表格更新
          // 生命周期的方法比如created,不会挂载到this身上，无法this.created
          this.getArtCateListFn()
          this.addVisible = false
        } else {
          return false
        }
      })
    },
    // 对话框内-取消按钮-点击事件
    cancelFn() {
      this.addVisible = false
    },
    // 对话框-关闭时的回调
    dialogCloseFn() {
      this.$refs.addRef.resetFields()
    },
    // 修改分类按钮 -》 点击事件（先做数据的回显）
    updateCateBtnFn(obj) {
      //
      console.log(obj)
      this.isEdit = true
      this.editId = obj.id
      this.addVisible = true
      // 真是的dom更新后再给数据回显 ，解决bug
      this.$nextTick(() => {
        // 数据回显（回填）
        this.addForm.cate_name = obj.cate_name
        this.addForm.cate_alias = obj.cate_alias
      })
    },
    // 删除分类按钮-点击事件
    async delCateFn(obj) {
      const { data: res } = await delArtCateAPI(obj.id)

      if (res.code !== 0) return this.$message.error(res.$message)
      this.$message.success(res.message)
      this.getArtCateListFn()
    },
  },
}
</script>

<style lang="less" scoped>
.header-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
