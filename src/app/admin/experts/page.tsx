import Link from 'next/link';
import { getExperts } from '@/lib/expert-db';

export default function AdminExpertsPage() {
  const experts = getExperts();
  
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-light tracking-wide text-primary">Experts</h1>          
          <p className="text-secondary mt-2">Manage your expert network</p>        </div>        
        <Link
          href="/admin/experts/new"
          className="px-6 py-3 accent-primary text-[var(--accent-gold)] rounded-lg hover:bg-[var(--accent-secondary)] transition-colors"
        >
          Add Expert
        </Link>      </div>      
      
      <div className="bg-card border border-primary rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-primary border-b border-primary">
            <tr>
              <th className="text-left py-4 px-6 text-sm font-medium text-secondary">Expert</th>              
              <th className="text-left py-4 px-6 text-sm font-medium text-secondary">Expertise</th>              
              <th className="text-left py-4 px-6 text-sm font-medium text-secondary">Rate</th>              
              <th className="text-left py-4 px-6 text-sm font-medium text-secondary">Status</th>              
              <th className="text-right py-4 px-6 text-sm font-medium text-secondary">Actions</th>            </tr>          </thead>          
          <tbody className="divide-y divide-primary">
            {experts.map((expert) => (
              <tr key={expert.id} className="hover:bg-primary/50 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full accent-primary flex items-center justify-center">
                      <span className="text-[var(--accent-gold)] font-display">{expert.name.charAt(0)}</span>                    </div>                    
                    <div>
                      <p className="text-primary font-medium">{expert.name}</p>                      
                      <p className="text-sm text-tertiary">{expert.title} at {expert.company}</p>                    </div>                  </div>                </td>                
                <td className="py-4 px-6">
                  <div className="flex flex-wrap gap-1">
                    {expert.expertise.slice(0, 2).map((exp) => (
                      <span key={exp} className="tag tag-outline text-[10px]">{exp}</span>                    ))}                    
                    {expert.expertise.length > 2 && (
                      <span className="tag tag-outline text-[10px]">+{expert.expertise.length - 2}</span>                    )}                  </div>                </td>                
                <td className="py-4 px-6">
                  <p className="text-primary">${expert.hourlyRate}/hr</p>                </td>                
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    {expert.verified && (
                      <span className="px-2 py-1 bg-[var(--accent-emerald)]/20 text-[var(--accent-emerald)] text-xs rounded-full">
                        Verified
                      </span>                    )}                    
                    {expert.featured && (
                      <span className="px-2 py-1 bg-[var(--accent-gold)]/20 text-[var(--accent-gold)] text-xs rounded-full">
                        Featured
                      </span>                    )}                  </div>                </td>                
                <td className="py-4 px-6 text-right">
                  <Link
                    href={`/admin/experts/${expert.id}`}
                    className="text-sm text-[var(--accent-emerald)] hover:underline"
                  >
                    Edit
                  </Link>                </td>              </tr>            ))}          </tbody>        </table>      </div>    </div>  );
}
