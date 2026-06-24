import fs from 'fs';
let content = fs.readFileSync('src/components/Storefront.tsx', 'utf8');
content = content.replace(/<div className="w-full mb-6">.*?className="hidden".*?<\/div>.*?<button.*?onClick=\{handleVerifyOtp\}.*?>/s, `<div className="w-full flex flex-col items-center">
                    <p className="text-slate-800 text-[15px] mb-2 font-medium self-start">An OTP has been sent to <span className="font-bold">{pendingPhone}</span>..</p>
                    <button className="text-[#00c09d] text-[15px] mb-8 font-medium hover:underline self-start bg-transparent border-none cursor-pointer p-0" onClick={() => setAuthStep("phone")}>Change number</button>

                    <div className="w-full flex justify-between gap-1 sm:gap-2 mb-8">
                       {[1,2,3,4,5,6].map((i) => (
                         <input 
                           key={i}
                           type="text" 
                           maxLength={1}
                           className="w-[38px] sm:w-[45px] h-[50px] border border-gray-300 rounded-lg text-center text-xl font-medium focus:border-[#00c09d] outline-none"
                           onChange={(e) => {
                             if (i === 1) setAuthOtp(e.target.value);
                             else if (i === 6) setAuthOtp(prev => prev + e.target.value);
                           }}
                         />
                       ))}
                    </div>
                  </div>
                  <button 
                    onClick={handleVerifyOtp}
                    className="w-full bg-[#00c09d] hover:bg-[#00b08f] text-white font-medium py-3.5 rounded-lg shadow-sm transition-colors text-[15px] mb-4"
                  >`);
fs.writeFileSync('src/components/Storefront.tsx', content);
