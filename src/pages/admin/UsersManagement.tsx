import { useUser } from "@clerk/clerk-react";
import { SUPER_ADMIN_EMAIL, HARDCODED_ADMINS, UserRole, getUserRole } from "../../lib/auth-utils";
import { Shield, User, Star, Settings, ExternalLink } from "lucide-react";

export default function UsersManagement() {
  const { user } = useUser();
  const currentEmail = user?.primaryEmailAddress?.emailAddress;
  const isSuperAdmin = currentEmail === SUPER_ADMIN_EMAIL;
  const role = getUserRole(currentEmail, user?.publicMetadata);

  const admins = [
    { email: SUPER_ADMIN_EMAIL, role: UserRole.SUPER_ADMIN, name: "Mehwish Sheikh" },
    ...HARDCODED_ADMINS.filter(e => e !== SUPER_ADMIN_EMAIL).map(e => ({ email: e, role: UserRole.CO_ADMIN, name: "Hardcoded Admin" }))
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-stone-800">Royal Registry</h1>
        <p className="text-stone-500 text-sm italic">Manage access to the Gourmet Haven chambers.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-stone-50 flex justify-between items-center bg-stone-50/30">
              <h3 className="font-bold uppercase tracking-widest text-xs text-stone-500">Authenticated High Council</h3>
              <Shield size={16} className="text-brand-primary" />
            </div>
            <div className="divide-y divide-stone-50">
              {admins.map((admin) => (
                <div key={admin.email} className="p-6 flex items-center justify-between hover:bg-stone-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${admin.role === UserRole.SUPER_ADMIN ? 'bg-stone-900 text-[#C5A059]' : 'bg-stone-100 text-stone-500'}`}>
                      {admin.role === UserRole.SUPER_ADMIN ? <Star size={20} /> : <User size={20} />}
                    </div>
                    <div>
                      <p className="font-serif text-stone-800">{admin.email}</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059]">{admin.role.replace('_', ' ')}</p>
                    </div>
                  </div>
                  {isSuperAdmin && admin.role !== UserRole.SUPER_ADMIN && (
                    <button className="text-stone-300 hover:text-red-500 transition">
                      Revoke
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {!isSuperAdmin && (
            <div className="bg-amber-50 p-6 border border-amber-200 rounded-3xl text-amber-800 text-sm flex gap-4 items-start">
              <Shield className="shrink-0 mt-0.5" size={18} />
              <div>
                <p className="font-bold uppercase tracking-widest text-[10px] mb-1">Restricted Access</p>
                <p className="italic leading-relaxed">
                  Only the Sovereign (Super Admin) may promote or demote members of the Council. 
                  Currently, <span className="font-bold underline">{SUPER_ADMIN_EMAIL}</span> holds this authority.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-stone-900 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden group">
            <Settings className="absolute -right-4 -top-4 text-white/5 group-hover:rotate-45 transition-transform duration-700" size={120} />
            <h4 className="text-xl font-serif mb-4 relative z-10 text-[#C5A059]">Role Guidance</h4>
            <div className="space-y-4 text-sm text-stone-400 relative z-10 leading-relaxed">
              <p>
                <strong className="text-white">Super Admin:</strong> Full control over Sanity content, orders, and user roles. Hardcoded to Mehwish.
              </p>
              <p>
                <strong className="text-white">Co-Admin:</strong> Can manage menu items, deals, and gallery.
              </p>
              <p>
                <strong className="text-white">To add an Admin:</strong> Ask the developer to include the email in <code className="bg-white/10 px-1 rounded">HARDCODED_ADMINS</code> or use Clerk Metadata.
              </p>
            </div>
            
            <a 
              href="https://clerk.com" 
              target="_blank" 
              rel="noreferrer"
              className="mt-8 flex items-center justify-between w-full p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition group"
            >
              <span className="text-xs font-bold uppercase tracking-widest">Open Clerk Console</span>
              <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
