import fs from 'fs';
let content = fs.readFileSync('src/components/Storefront.tsx', 'utf8');

const regex = /{bottomTab === "profile" && \(\(\) => \{.+?(?=<div className="fixed bottom-0 left-0 right-0)/s;

const replacement = '{bottomTab === "profile" && (() => {\\n' +
'         if (!currentSession) {\\n' +
'           return (\\n' +
'             <div className="flex-grow bg-[#f0f2f5] p-4 flex flex-col justify-center min-h-[calc(100vh-140px)] w-full">\\n' +
'               <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center">\\n' +
'                 <div className="w-14 h-14 bg-teal-50 rounded-full flex items-center justify-center mb-4 text-[#00c09d]">\\n' +
'                   <User className="w-7 h-7" />\\n' +
'                 </div>\\n' +
'                 \\n' +
'                 <h3 className="text-sm font-bold text-slate-800 text-center uppercase tracking-normal">Log In Required</h3>\\n' +
'                 <p className="text-[12px] text-gray-500 text-center mt-1 mb-6 leading-relaxed max-w-[280px]">\\n' +
'                   Log in to view your profile, manage addresses, and check order history.\\n' +
'                 </p>\\n' +
'                 \\n' +
'                 <button \\n' +
'                   onClick={() => { setShowAuthModal(true); setAuthStep("phone"); }}\\n' +
'                   className="w-full bg-[#00c09d] hover:bg-[#00b08f] text-white text-sm font-bold py-3.5 rounded-lg shadow-sm transition-all focus:outline-none"\\n' +
'                 >\\n' +
'                   Login / Sign Up\\n' +
'                 </button>\\n' +
'               </div>\\n' +
'             </div>\\n' +
'           );\\n' +
'         }\\n' +
'\\n' +
'         return (\\n' +
'           <AccountPanel \\n' +
'             currentSession={currentSession} \\n' +
'             orders={orders} \\n' +
'             onLogout={() => { onLogoutSession(); setBottomTab("home"); }} \\n' +
'             wishlist={wishlist} \\n' +
'             products={products} \\n' +
'             onOpenCart={onOpenCart} \\n' +
'             onClose={() => setBottomTab("home")} \\n' +
'             inline={true}\\n' +
'           />\\n' +
'         );\\n' +
'      })()}\\n\\n      ';

content = content.replace(regex, replacement);
fs.writeFileSync('src/components/Storefront.tsx', content);
