import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar showHomeLink />

      <div className="pt-32 pb-24 px-6 sm:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extralight tracking-wider mb-8 text-black">
            隐私政策
          </h1>
          <div className="w-24 h-px bg-black mb-12"></div>

          <div className="prose prose-sm max-w-none text-gray-900 space-y-6">
            <p className="text-sm text-gray-600">最后更新日期：2024年1月1日</p>

            <section>
              <h2 className="text-2xl font-light tracking-wide mb-4 text-black">1. 信息收集</h2>
              <p className="text-base font-light leading-relaxed text-gray-800">
                我们收集您在使用本网站时主动提供的信息，包括但不限于姓名、电子邮件地址、联系信息等。
                我们还可能自动收集某些技术信息，如IP地址、浏览器类型、访问时间等。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light tracking-wide mb-4 text-black">2. 信息使用</h2>
              <p className="text-base font-light leading-relaxed text-gray-800">
                我们使用收集的信息用于：
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base font-light text-gray-800">
                <li>提供、维护和改进我们的服务</li>
                <li>处理您的请求和交易</li>
                <li>向您发送重要通知和更新</li>
                <li>分析网站使用情况以改善用户体验</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-light tracking-wide mb-4 text-black">3. 信息共享</h2>
              <p className="text-base font-light leading-relaxed text-gray-800">
                我们不会向第三方出售、交易或转让您的个人信息，除非：
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base font-light text-gray-800">
                <li>获得您的明确同意</li>
                <li>法律要求或法律程序要求</li>
                <li>保护我们的权利、财产或安全</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-light tracking-wide mb-4 text-black">4. 数据安全</h2>
              <p className="text-base font-light leading-relaxed text-gray-800">
                我们采取合理的技术和组织措施来保护您的个人信息免受未经授权的访问、使用或披露。
                但是，请注意互联网传输或电子存储方法都不是100%安全的。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light tracking-wide mb-4 text-black">5. Cookie使用</h2>
              <p className="text-base font-light leading-relaxed text-gray-800">
                我们使用Cookie和类似技术来改善您的浏览体验、分析网站流量并个性化内容。
                您可以通过浏览器设置管理Cookie偏好。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light tracking-wide mb-4 text-black">6. 您的权利</h2>
              <p className="text-base font-light leading-relaxed text-gray-800">
                您有权：
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base font-light text-gray-800">
                <li>访问、更正或删除您的个人信息</li>
                <li>撤回您对数据处理同意的权利</li>
                <li>反对某些数据处理活动</li>
                <li>数据可移植性</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-light tracking-wide mb-4 text-black">7. 联系我们</h2>
              <p className="text-base font-light leading-relaxed text-gray-800">
                如果您对本隐私政策有任何疑问或需要行使您的权利，请通过以下方式联系我们：
              </p>
              <p className="text-base font-light leading-relaxed text-gray-800 mt-4">
                电子邮件：contact@mattertouch.com<br />
                微信：mattertouch
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light tracking-wide mb-4 text-black">8. 政策变更</h2>
              <p className="text-base font-light leading-relaxed text-gray-800">
                我们保留随时修改本隐私政策的权利。任何变更将在本页面上发布，并更新&quot;最后更新日期&quot;。
                我们建议您定期查看本政策以了解任何变更。
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <Link
              href="/"
              className="text-sm font-light tracking-widest uppercase text-black hover:opacity-60 transition-opacity"
            >
              ← 返回首页
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

