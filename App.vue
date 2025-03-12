<script>
export default {
  onLaunch: function() {
    console.log('App Launch');
  },
  onShow: function() {
    console.log('App Show');
  },
  onHide: function() {
    console.log('App Hide');
  }
};
</script>

<style>
@import './static/fonts/iconfont.css';

/* 全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

page {
  background-color: #f8f8f8;
  padding-top: var(--status-bar-height);
}

/* 状态栏占位符 */
.status-bar {
  height: var(--status-bar-height);
  width: 100%;
}
</style>
