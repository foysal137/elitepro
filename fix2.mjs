import fs from 'fs';
let content = fs.readFileSync('src/components/Storefront.tsx', 'utf8');
content = content.replace(/className="w-full bg-\[#00c09d\] hover:bg-\[#00b08f\] text-white font-medium py-3.5 rounded-lg shadow-sm transition-colors text-\[15px\] mb-4"\s*>\s*Verify\s*<\/button>/, `className="w-full bg-[#00c09d] hover:bg-[#00b08f] text-white font-medium py-3.5 rounded-lg shadow-sm transition-colors text-[15px] mb-4"\n                  >\n                    Verify\n                  </button>\n                  <p className="text-slate-500 text-sm text-center w-full">Code expires in 01:29s</p>`);
fs.writeFileSync('src/components/Storefront.tsx', content);
