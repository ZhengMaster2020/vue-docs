module.exports = {
  title: 'FontEnd summary doc',
  description: '用心，谈技术。已有前端知识体系梳理、设计模式手册、Webpack4教程，欢迎浏览',
  base: '/vuepress-docs/',
  head: [
    ['link', { rel: 'icon', href: `/favicon.ico` }],
  ],
  themeConfig: {
    repo: 'ZhengMaster2020/vuepress-docs/',
    editLinks: true,
    nav: [
      { text: 'Home', link: '/' },
      { text: 'JS知识', link: '/js/' },
      {
        text: 'HTML/CSS',
        items: [
          { text: 'html', link: '/html/' },
          { text: 'css', link: '/css/' }
        ]
      },
      {
        text: 'React/Vue框架',
        items: [
          { text: 'React', link: '/react/' },
          { text: 'Vue', link: '/vue/' }
        ]
      },
      { text: '网络与安全', link: '/net/' },
      { 
        text: '其它方面',
        items: [
          { text: '数据结构与算法', link: '/datas-algorithms/' },
          { text: '资源共享', link: '/share/'},
          { text: '关于本站', link: '/about/'},
        ]
      }
    ],
    sidebar: 'auto',
    lastUpdated: '最近更新为'
  }
}