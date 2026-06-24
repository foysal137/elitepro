import fs from 'fs';
let content = fs.readFileSync('src/components/Storefront.tsx', 'utf8');

const regex = /{authStep === "phone" \? \(.*?(?=\s*<\/div>\s*<\/div>\s*\)\s*}\s*<\/div>\s*\)\s*})/s;

const newContent = `{authStep === "phone" ? (
               <>
                 <h2 className="text-[22px] font-bold tracking-tight text-slate-800 text-center mb-1">Continue with Phone Number</h2>
                 <p className="text-slate-500 text-center text-[15px] mb-8 max-w-[260px]">Enjoy exciting deals and offers & checkout faster</p>
                 
                 <div className="w-full mb-5">
                   <label className="block text-slate-700 font-medium text-[15px] mb-2">Phone Number</label>
                   <div className="relative">
                     <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">+88</span>
                     <input 
                       type="tel" 
                       placeholder="01XXXXXXXXX" 
                       value={pendingPhone}
                       onChange={(e) => setPendingPhone(e.target.value)}
                       className="w-full border border-gray-300 rounded-lg pl-12 pr-4 py-3.5 outline-none focus:border-[#00c09d] transition-colors text-[15px]" 
                     />
                   </div>
                 </div>
                 
                 <button 
                   onClick={handleSendOtp}
                   className="w-full bg-[#00c09d] hover:bg-[#00b08f] text-white font-medium py-3.5 rounded-lg shadow-sm transition-colors text-[16px]"
                 >
                   Send OTP
                 </button>
               </>
             ) : authStep === "otp" ? (
                <>
                 <div className="flex flex-col items-center">
                   <div className="w-[60px] h-[60px] mb-4">
                     <svg viewBox="0 0 100 100" className="w-full h-full text-[#142e43]" fill="currentColor">
                        <path d="M20,20 L50,0 L80,20 L80,80 L50,100 L20,80 Z" />
                        <path d="M50,45 L80,25 M20,25 L50,45 L50,100" stroke="#00c09d" strokeWidth="6" />
                        <path d="M40,30 L60,30 C65,30 65,40 60,40 L40,40 Z" fill="#00c09d"/>
                     </svg>
                   </div>
                   <h2 className="text-[26px] font-bold tracking-tight text-slate-800 text-center mb-2">OTP Verification</h2>
                   <p className="text-slate-600 text-center text-[15px] mb-8">Please enter it below to continue shopping</p>
                   
                   <p className="text-slate-800 text-[15px] mb-1 font-medium self-start w-full">An OTP has been sent to <span className="font-bold">{pendingPhone}</span>..</p>
                   <button className="text-[#00c09d] text-[15px] mb-6 font-medium hover:underline self-start bg-transparent border-none cursor-pointer p-0" onClick={() => setAuthStep("phone")}>Change number</button>

                   <div className="w-full flex justify-between gap-1 sm:gap-2 mb-8">
                      {[1,2,3,4,5,6].map((i) => (
                        <input 
                          key={i}
                          type="text" 
                          maxLength={1}
                          className="w-[42px] sm:w-[48px] h-[52px] border border-gray-300 rounded-lg text-center text-2xl font-medium focus:border-[#00c09d] outline-none shadow-sm"
                          onChange={(e) => {
                            if (i === 1) setAuthOtp(e.target.value);
                            else if (i === 6) setAuthOtp(prev => prev + e.target.value);
                          }}
                        />
                      ))}
                   </div>
                   <button 
                     onClick={() => { handleVerifyOtp(); setAuthOtp('1234'); }}
                     className="w-full bg-[#00c09d] hover:bg-[#00b08f] text-white font-medium py-3.5 rounded-lg shadow-sm transition-colors text-[16px] mb-5 mt-2"
                   >
                     Verify
                   </button>
                   <p className="text-slate-500 text-[15px] text-center w-full">Code expires in 01:29s</p>
                 </div>
                </>
             ) : (
                <>
                  <h2 className="text-[22px] font-bold tracking-tight text-slate-800 text-center mb-1">Complete Profile</h2>
                  <p className="text-slate-500 text-center text-[15px] mb-8 max-w-[260px]">Add your details to secure your account</p>
                  
                  <div className="w-full mb-6">
                    <label className="block text-slate-700 font-medium text-[15px] mb-2">Your Full Name</label>
                    <input 
                      type="text"
                      value={pendingName}
                      onChange={(e) => setPendingName(e.target.value)}
                      placeholder="e.g. Abul Kashem"
                      className="w-full border border-gray-300 focus:border-[#00c09d] rounded-lg px-4 py-3.5 text-[15px] outline-none transition-colors"
                    />
                  </div>
                  
                  <button 
                    onClick={() => {
                      if (!pendingName) {
                        alert("Please enter your name");
                        return;
                      }
                      onLoginSession({ name: pendingName, phone: pendingPhone });
                      setShowAuthModal(false);
                      setIsProfileDrawerOpen(false);
                      setBottomTab("profile");
                    }}
                    className="w-full bg-[#82dfca] hover:bg-[#00c09d] text-white font-semibold py-3.5 rounded-lg shadow transition-colors text-[15px]"
                  >
                    Save & Login
                  </button>
                  
                  <div className="w-full mt-8">
                    <div className="relative flex items-center mb-6">
                      <div className="flex-grow border-t border-gray-200"></div>
                      <span className="flex-shrink-0 mx-4 text-gray-500 text-xs text-center font-medium">Or continue with</span>
                      <div className="flex-grow border-t border-gray-200"></div>
                    </div>
                    
                    <div className="flex flex-col gap-3 w-full">
                      <button className="w-full flex items-center justify-center gap-2 border border-gray-200 rounded-lg py-3 hover:bg-slate-50 transition-colors shadow-sm" onClick={() => { onLoginSession({ name: pendingName || "Google User", phone: pendingPhone }); setShowAuthModal(false); setIsProfileDrawerOpen(false); setBottomTab("profile"); }}>
                        <svg className="w-5 h-5" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8 2.9l6.3-6.3C34.6 3.2 29.6 1 24 1 11.3 1 1 11.3 1 24s10.3 23 23 23c12.1 0 22.4-9 23.8-20.7z" /><path fill="#FF3D00" d="M6.3 14.6l6.6 4.8c1.7-4.4 6-7.4 11.1-7.4 3.1 0 5.9 1.1 8 2.9l6.3-6.3C34.6 3.2 29.6 1 24 1 15 1 7.2 6.1 3 13.9l3.3 0.7z" /><path fill="#4CAF50" d="M24 44c5.2 0 9.8-1.7 13.2-4.6l-6.7-5.3C28.8 35.8 26.6 37 24 37c-5.8 0-10.7-3.8-12.4-9l-6.6 5C9 40.5 15.9 44 24 44z" /><path fill="#1976D2" d="M43.6 20H43v-2H24v8.5h11.8C34.7 33.9 30.1 37 24 37v2c5.8 0 10.7-3.8 12.4-9h6.7c0.4-1.9 0.6-3.8 0.6-5.8 0-1.4-0.1-2.8-0.1-4.2z" /></svg>
                        <span className="text-[15px] font-semibold text-slate-700">Google</span>
                      </button>
                      <button className="w-full flex items-center justify-center gap-2 border border-gray-200 rounded-lg py-3 hover:bg-slate-50 transition-colors shadow-sm" onClick={() => { onLoginSession({ name: pendingName || "Facebook User", phone: pendingPhone }); setShowAuthModal(false); setIsProfileDrawerOpen(false); setBottomTab("profile"); }}>
                        <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                        <span className="text-[15px] font-semibold text-slate-700">Facebook</span>
                      </button>
                      <button className="w-full flex items-center justify-center gap-2 border border-gray-200 rounded-lg py-3 hover:bg-slate-50 transition-colors shadow-sm" onClick={() => { onLoginSession({ name: pendingName || "Email User", phone: pendingPhone }); setShowAuthModal(false); setIsProfileDrawerOpen(false); setBottomTab("profile"); }}>
                        <svg className="w-5 h-5 text-gray-500 relative" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                        <span className="text-[15px] font-semibold text-slate-700">Email</span>
                      </button>
                    </div>
                  </div>
                </>
             )}`;

if (regex.test(content)) {
  content = content.replace(regex, newContent);
  fs.writeFileSync('src/components/Storefront.tsx', content);
} else {
  console.log("Regex mismatched!");
}
