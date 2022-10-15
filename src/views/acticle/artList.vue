<template>
  <div>
    <!-- 内容区域 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>文章列表</span>
      </div>
      <!-- 搜索区域 -->
      <div class="search-box">
        <el-form :inline="true" :model="q">
          <el-form-item label="文章分类">
            <el-select
              v-model="q.cate_id"
              placeholder="请选择分类"
              size="small"
            >
              <!-- 循环渲染分类的可选项 -->
              <el-option
                :label="item.cate_name"
                :value="item.id"
                v-for="item in cateList"
                :key="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发布状态" style="margin-left: 15px">
            <el-select v-model="q.state" placeholder="请选择状态" size="small">
              <el-option label="已发布" value="已发布"></el-option>
              <el-option label="草稿" value="草稿"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="choseFn"
              >筛选</el-button
            >
            <el-button type="info" size="small" @click="resetFn"
              >重置</el-button
            >
          </el-form-item>
        </el-form>
        <!-- 发表文章的按钮 -->

        <el-button
          type="primary"
          size="small"
          class="btn-pub"
          @click="showPubDialogFn"
          >发表文章</el-button
        >
      </div>

      <!-- 文章表格区域 -->
      <el-table :data="artList" style="width: 100%" border stripe>
        <el-table-column label="文章标题" prop="title">
          <template v-slot="scope">
            <el-link type="primary" @click="showDetailFn(scope.row.id)">{{
              scope.row.title
            }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="分类" prop="cate_name"></el-table-column>
        <el-table-column label="发表时间" prop="pub_date">
          <template v-slot="scope">
            <span>{{ $formatDate(scope.row.pub_date) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="state"></el-table-column>

        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-button type="danger" size="mini" @click="removeFn(row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChangeFn"
        @current-change="handleCurrentChangeFn"
        :current-page.sync="q.pagenum"
        :page-sizes="[2, 3, 5, 10]"
        :page-size.sync="q.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 发表文章的Dialog对话框 -->
    <el-dialog
      title="发表文章"
      :visible.sync="pubDialogVisible"
      fullscreen
      :before-close="handleClose"
      @close="dialogCloseFn"
    >
      <!-- 发布文章的对话框 -->
      <el-form
        :model="pubForm"
        :rules="pubFormRules"
        ref="pubFormRef"
        label-width="100px"
      >
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="pubForm.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="文章分类" prop="cate_id">
          <el-select
            v-model="pubForm.cate_id"
            placeholder="请选择分类"
            style="width: 100%"
          >
            <!-- 循环渲染分类的可选项 -->
            <el-option
              :label="item.cate_name"
              :value="item.id"
              v-for="item in cateList"
              :key="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文章内容" prop="content">
          <quill-editor
            v-model="pubForm.content"
            @blur="contentChangeFn"
          ></quill-editor>
        </el-form-item>
        <el-form-item label="文章封面" prop="cover_img">
          <!-- 用来显示封面的图片 -->
          <img
            src="../../assets/images/cover.jpg"
            alt=""
            class="cover-img"
            ref="imgRef"
          />
          <br />
          <!-- 文件选择框，默认被隐藏 -->
          <input
            type="file"
            style="display: none"
            ref="iptFileRef"
            accept="image/*"
            @change="onCoverChangeFn"
          />
          <!-- 选择封面的按钮 -->

          <el-button type="text" @click="chooseImgFn">+ 选择封面</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="pubArticleFn('已发布')"
            >发布</el-button
          >
          <el-button type="info" @click="pubArticleFn('草稿')"
            >存为草稿</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 查看文章详情的对话框 -->
    <el-dialog title="文章预览" :visible.sync="detailVisible" width="80%">
      <h1 class="title">{{ artDetail.title }}</h1>

      <div class="info">
        <span>作者：{{ artDetail.nickname || artDetail.username }}</span>
        <span>发布时间：{{ $formatDate(artDetail.pub_date) }}</span>
        <span>所属分类：{{ artDetail.cate_name }}</span>
        <span>状态：{{ artDetail.state }}</span>
      </div>

      <!-- 分割线 -->
      <el-divider></el-divider>

      <!-- 文章的封面 -->
      <img
        v-if="artDetail.cover_img"
        :src="baseURL + artDetail.cover_img"
        alt=""
      />

      <!-- 文章的详情 -->
      <div v-html="artDetail.content" class="detail-box"></div>
    </el-dialog>
  </div>
</template>

<script>
import imgObj from '../../assets/images/cover.jpg'
import {
  getArtCateListAPI,
  getArtListAPI,
  uploadArticleAPI,
  getArtDetailAPI,
  delArticleAPI,
} from '@/api'
export default {
  name: 'ArtList',
  data() {
    return {
      baseURL: 'http://big-event-vue-api-t.itheima.net',
      detailVisible: false,
      artDetail: {}, // 文章详情
      total: 0, // 保存现有文章的总数
      artList: [], // 保存文章分类列表
      cateList: [], // 保存文章分类列表
      // 查询参数对象
      q: {
        pagenum: 1, // 默认拿第一页的数据
        pagesize: 2, // 默认当前页需要几条数据
        cate_id: '',
        state: '',
      },
      pubDialogVisible: false, // 控制发表文章对话框的显示与隐藏
      pubForm: {
        // 表单的数据对象
        title: '',
        cate_id: '',
        content: '', // 文章内容
        cover_img: null, // 用户选择的封面图片（null 表示没有选择任何封面）
        state: '', // 发布状态（值：“已发布”，"草稿"）
      },
      pubFormRules: {
        // 表单的验证规则对象
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          {
            min: 1,
            max: 30,
            message: '文章标题的长度为1-30个字符',
            trigger: 'blur',
          },
        ],
        cate_id: [
          { required: true, message: '请选择文章标题', trigger: 'change' },
        ],
        content: [
          { required: true, message: '请输入文章内容', trigger: 'blur' },
        ],
        cover_img: [{ required: true, message: '请选择封面', trigger: 'blur' }],
      },
    }
  },
  methods: {
    // 发表文章按钮->点击事件->让添加文章对话框出现
    showPubDialogFn() {
      this.pubDialogVisible = true
    },
    // 对话框关闭前的回调
    async handleClose(done) {
      // 询问用户是否确认关闭对话框
      const confirmResult = await this.$confirm(
        '此操作将导致文章信息丢失, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)

      // 取消了关闭-阻止住, 什么都不干
      if (confirmResult === 'cancel') return
      // 确认关闭
      done()
    },
    // 初始化文章分类的列表数据
    async initCateList() {
      const { data: res } = await this.$http.get('/my/cate/list')
      if (res.code === 0) {
        this.cateList = res.data
      }
    },
    // 获取所有的分类
    async getCateListFn() {
      const { data: res } = await getArtCateListAPI()
      this.cateList = res.data
    },
    //  获取所有文章列表
    async getArticleListFn() {
      const { data: res } = await getArtListAPI(this.q)
      this.artList = res.data // 保存当前获取的文章列表：有分页不是所有的数据
      this.total = res.total // 保存总是
    },
    //
    chooseImgFn() {
      this.$refs.iptFileRef.click()
    },
    // 封面选择改变的事件
    onCoverChangeFn(e) {
      // 获取用户选择的文件列表
      const files = e.target.files
      if (files.length === 0) {
        // 用户没有选择封面
        this.pubForm.cover_img = null
        // img要显示回默认cover.png
        this.$refs.imgRef.setAttribute('src', imgObj)
      } else {
        // 用户选择了封面
        this.pubForm.cover_img = files[0]
        // 把图片文件。要显示到img标签里
        const url = URL.createObjectURL(files[0])
        this.$refs.imgRef.setAttribute('src', url)
      }
      // 让表单走单独的校验
      this.$refs.pubFormRef.validateField('cover_img')
    },
    // 表单里（点击发布/存为草稿）按钮点击事件--准备调用后端接口
    pubArticleFn(str) {
      // str的值“已发布”，或者“草稿” （后端要求的参数）
      this.pubForm.state = str // 保存到统一表单对象上

      // 兜底校验
      this.$refs.pubFormRef.validate(async (valid) => {
        if (valid) {
          console.log(this.pubForm.state)
          const fd = new FormData() // 准备一个表单容器
          // fd.append('参数名',值)
          fd.append('title', this.pubForm.title)
          fd.append('cate_id', this.pubForm.cate_id)
          fd.append('content', this.pubForm.content)
          fd.append('cover_img', this.pubForm.cover_img)
          fd.append('state', this.pubForm.state)

          // 发起请求
          const { data: res } = await uploadArticleAPI(fd)
          if (res.code !== 0) return this.$message.error('发布文章失败！')
          this.$message.success('发布文章成功！')

          // 关闭对话框
          this.pubDialogVisible = false
          // 刷新文章列表-请求文章列表数据
          this.getArticleListFn()
        } else {
          return false
        }
      })
    },
    // 富文本内容改变事件
    contentChangeFn() {
      this.$refs.pubFormRef.validateField('content')
    },
    // 新增文章-- 对话框关闭时- 清空表单
    dialogCloseFn() {
      this.$refs.pubFormRef.resetFields()
      // 我们需要手动给封面标签img重新设置一个值，
      this.$refs.imgRef.setAttribute('src', imgObj)
    },
    // 分页- 每页条数改变触发
    handleSizeChangeFn(sizes) {
      // sizes : 当前需要每页显示的条数
      //
      this.q.pagesize = sizes
      this.getArticleListFn()
    },
    // 当前页码改变时
    handleCurrentChangeFn(nowPage) {
      // nowPage : 当前要看的第几页，页数
      this.q.pagenum = nowPage
      // this.q.pagenum = 1
      this.getArticleListFn()
    },
    // 筛选按钮的点击事件
    choseFn() {
      // 当有了筛选的条件，我想让页码回归1，每页条数为2
      this.q.pagenum = 1
      this.q.pagesize = 2

      this.getArticleListFn()
    },
    // 重置按钮的点击事件
    resetFn() {
      this.q.pagenum = 1
      this.q.pagesize = 2
      this.q.cate_id = ''
      this.q.state = '' // 对象改变，v-model关联的表单也会为空
      this.getArticleListFn()
    },
    // 文章标题点击事件 - 为了查看详情
    async showDetailFn(artID) {
      this.detailVisible = true // 让详情的对话框出现
      // artID 文章的id值
      const res = await getArtDetailAPI(artID)
      console.log(res)
      this.artDetail = res.data.data
    },
    // 删除文章按钮点击事件
    async removeFn(artId) {
      const { data: res } = await delArticleAPI(artId)
      if (res.code !== 0) return this.$message.error(res.message)
      this.$message.success('删除文章成功')

      if (this.artList.length === 1) {
        if (this.q.pagenum > 1) {
          this.q.pagenum--
        }
      }
      // 把条件重置 。请求数据
      this.getArticleListFn()
    },
  },
  created() {
    // 请求分类数据
    this.getCateListFn()
    // 请求文章列表
    this.getArticleListFn()
  },
  //
}
</script>

<style lang="less" scoped>
.search-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  .btn-pub {
    margin-top: 5px;
  }
}
// 设置富文本编辑器的默认最小高度
// ::v-deep作用: 穿透选择, 正常style上加了scope的话, 会给.ql-editor[data-v-hash]属性, 只能选择当前页面标签或者组件的根标签
// 如果想要选择组件内的标签(那些标签没有data-v-hash值)所以正常选择选不中, 加了::v-deep空格前置的话, 选择器就会变成如下形式
// [data-v-hash] .ql-editor 这样就能选中组件内的标签的class类名了
::v-deep .ql-editor {
  min-height: 300px;
}
// 设置图片封面的宽高
.cover-img {
  width: 400px;
  height: 280px;
  object-fit: cover;
}
.el-pagination {
  margin-top: 15px;
}
</style>
