import { useStaff } from '../hooks/useStaff';
import { Link } from 'react-router-dom';
import { User, Search, SlidersHorizontal, ArrowRight, ShieldCheck, MapPin, Clock } from 'lucide-react';

export default function StaffDirectory() {
  const { data: staff, isLoading } = useStaff();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Caregiver Directory</h1>
          <p className="text-surface-400">Browse 24K+ qualified professionals by specialty and location.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
            <input 
              type="text" 
              placeholder="Filter by specialty or location..." 
              className="pl-10 pr-4 py-2 bg-surface-50 border border-surface-200 rounded-lg text-white w-full md:w-80"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-surface-50 border border-surface-200 rounded-lg text-surface-400 hover:text-white transition-colors">
            <SlidersHorizontal className="w-5 h-5" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          [1,2,3,4].map(i => <div key={i} className="h-96 bg-surface-50 animate-pulse rounded-xl" />)
        ) : (
          staff?.map(person => (
            <Link key={person.id} to={`/staff/${person.id}`} className="group bg-surface-50 border border-surface-200 rounded-xl overflow-hidden hover:border-primary/50 transition-all card-hover">
              <div className="aspect-[4/5] relative overflow-hidden bg-surface-100">
                <img src={person.imageUrl} alt={person.name} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute top-3 left-3 px-2 py-1 bg-surface-900/80 backdrop-blur-md rounded text-xs font-bold text-white">
                  {person.role}
                </div>
                {person.backgroundChecked && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-accent-success rounded-full flex items-center justify-center shadow-lg">
                    <ShieldCheck className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium text-white mb-1">{person.name}</h3>
                <div className="flex items-center gap-1 text-xs text-surface-400 mb-3">
                  <MapPin className="w-3 h-3" />
                  <span>{person.location} ({person.radius}mi)</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-4">
                  {person.specialties.slice(0, 2).map(s => (
                    <span key={s} className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] rounded font-medium">{s}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between border-t border-surface-200 pt-4 mt-auto">
                  <div className="text-sm">
                    <span className="text-white font-bold">${person.hourlyRate}</span>
                    <span className="text-surface-400">/hr</span>
                  </div>
                  <span className="text-primary group-hover:gap-2 transition-all flex items-center gap-1 text-sm font-medium">
                    Profile <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
