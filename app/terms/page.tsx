import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar showHomeLink />

      <div className="pt-32 pb-24 px-6 sm:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extralight tracking-wider mb-8 text-black">
            使用条款
          </h1>
          <div className="w-24 h-px bg-black mb-12"></div>

          <div className="prose prose-sm max-w-none text-gray-900 space-y-6">
            <p className="text-sm text-gray-600">最后更新日期：2024年1月1日</p>

            <section>
              <h2 className="text-2xl font-light tracking-wide mb-4 text-black">1. 接受条款</h2>
              <p className="text-base font-light leading-relaxed text-gray-800">
                通过访问和使用本网站，您同意遵守并受本使用条款的约束。
                如果您不同意这些条款，请不要使用本网站。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light tracking-wide mb-4 text-black">2. 网站使用</h2>
              <p className="text-base font-light leading-relaxed text-gray-800">
                您同意仅将本网站用于合法目的，并遵守所有适用的法律法规。
                您不得：
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base font-light text-gray-800">
                <li>以任何可能损害、禁用、超载或损害网站的方式使用本网站</li>
                <li>尝试未经授权访问网站的任何部分、其他账户、计算机系统或网络</li>
                <li>使用任何自动化系统访问网站</li>
                <li>传输任何包含病毒、恶意代码或其他有害组件的材料</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-light tracking-wide mb-4 text-black">3. 知识产权</h2>
              <p className="text-base font-light leading-relaxed text-gray-800">
                本网站及其所有内容，包括但不限于文本、图形、徽标、图标、图像、音频剪辑、数字下载和软件，
                均为我们的财产或我们的内容提供商的财产，受版权、商标和其他知识产权法保护。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light tracking-wide mb-4 text-black">4. 产品信息</h2>
              <p className="text-base font-light leading-relaxed text-gray-800">
                我们努力确保网站上显示的产品信息准确完整。
                但是，我们不保证所有产品描述、价格或其他内容完全准确、完整、可靠、最新或无错误。
                我们保留更正任何错误、不准确或遗漏的权利。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light tracking-wide mb-4 text-black">5. 免责声明</h2>
              <p className="text-base font-light leading-relaxed text-gray-800">
                本网站按&quot;现状&quot;和&quot;可用&quot;的基础提供。
                我们不保证网站将始终可用、不间断、安全或无错误。
                在法律允许的最大范围内，我们不对因使用或无法使用本网站而产生的任何直接、间接、偶然或后果性损害承担责任。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light tracking-wide mb-4 text-black">6. 链接到第三方网站</h2>
              <p className="text-base font-light leading-relaxed text-gray-800">
                本网站可能包含指向第三方网站的链接。
                这些链接仅为方便您而提供。
                我们不控制这些网站的内容，也不对任何第三方网站的内容或可用性负责。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light tracking-wide mb-4 text-black">7. 用户内容</h2>
              <p className="text-base font-light leading-relaxed text-gray-800">
                如果您向我们提交任何内容（包括但不限于评论、反馈、建议），
                您授予我们非独占、免版税、永久、不可撤销和完全许可的权利，
                以使用、复制、修改、改编、发布、翻译和分发此类内容。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light tracking-wide mb-4 text-black">8. 终止</h2>
              <p className="text-base font-light leading-relaxed text-gray-800">
                我们保留随时终止或暂停您访问本网站的权利，无需事先通知或理由，
                包括但不限于违反本使用条款的情况。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light tracking-wide mb-4 text-black">9. 适用法律</h2>
              <p className="text-base font-light leading-relaxed text-gray-800">
                本使用条款受中华人民共和国法律管辖。
                任何因本条款引起的争议应通过友好协商解决；
                协商不成的，应提交有管辖权的人民法院解决。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light tracking-wide mb-4 text-black">10. 联系我们</h2>
              <p className="text-base font-light leading-relaxed text-gray-800">
                如果您对本使用条款有任何疑问，请通过以下方式联系我们：
              </p>
              <p className="text-base font-light leading-relaxed text-gray-800 mt-4">
                电子邮件：contact@mattertouch.com<br />
                微信：mattertouch
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light tracking-wide mb-4 text-black">11. 条款变更</h2>
              <p className="text-base font-light leading-relaxed text-gray-800">
                我们保留随时修改本使用条款的权利。
                任何变更将在本页面上发布，并更新&quot;最后更新日期&quot;。
                您继续使用本网站即表示您接受修改后的条款。
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

