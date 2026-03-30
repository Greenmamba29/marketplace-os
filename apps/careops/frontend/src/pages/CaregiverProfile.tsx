import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStaff } from '../hooks/useStaff';
import { Heart, ShieldCheck, MapPin, Clock, Calendar, Star, ArrowLeft, Languages, Award } from 'lucide-react';

export default function CaregiverProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: staff } = useStaff();
  const person = staff?.find(p => p.id === id);

  if (!person) return <div className="p-20 text-center text-surface-400">Profile not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/staff" className="inline-flex items-center gap-2 text-surface-400 hover:text-white mb-8 transition-colors">
        <ArrowLeft className="w-5 h-5" />
        Back to Directory
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 space-y-6">
          <div className="aspect-[4/5] bg-surface-50 border border-surface-200 rounded-2xl overflow-hidden relative">
            <img src={person.imageUrl} alt={person.name} className="w-full h-full object-cover" />
            <div className="absolute bottom-4 left-4 right-4 p-4 glass rounded-xl border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-surface-400 uppercase font-bold tracking-widest">Hourly Rate</div>
                  <div className="text-2xl font-bold text-white">${person.hourlyRate}</div>
                </div>
                <button className="bg-primary text-white p-3 rounded-lg hover:bg-primary-600">
                  <Heart className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-surface-50 border border-surface-200 rounded-2xl space-y-4">
            <h3 className="text-lg font-display font-bold text-white">Verification Status</h3>
            <div className="flex items-center gap-3 p-3 bg-accent-success/10 border border-accent-success/20 rounded-lg">
              <ShieldCheck className="w-5 h-5 text-accent-success" />
              <span className="text-sm font-medium text-white">Background Check Verified</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-primary/10 border border-primary/20 rounded-lg">
              <Award className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-white">{person.role} Certification Active</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-display font-bold text-white">{person.name}</h1>
              <span className="px-3 py-1 bg-surface-100 border border-surface-200 rounded-full text-xs font-bold text-primary uppercase">{person.role}</span>
            </div>
            <div className="flex items-center gap-4 text-surface-400">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{person.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-primary" />
                <span>{person.experienceYears} Years Experience</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-display font-bold text-white">Specialties</h3>
              <div className="flex flex-wrap gap-2">
                {person.specialties.map(s => (
                  <span key={s} className="px-4 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm text-white">{s}</span>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-display font-bold text-white">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {person.languages.map(l => (
                  <span key={l} className="flex items-center gap-2 px-4 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm text-white">
                    <Languages className="w-4 h-4 text-primary" />
                    {l}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 bg-surface-50 border border-surface-200 rounded-2xl space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-display font-bold text-white">Availability</h3>
              <span className="text-primary text-sm font-medium">{person.availability}</span>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                <div key={i} className={`aspect-square rounded-lg border flex flex-col items-center justify-center ${i < 5 ? 'border-primary/50 bg-primary/5' : 'border-surface-200 bg-surface-100 opacity-50'}`}>
                  <span className="text-[10px] text-surface-400 uppercase">{day}</span>
                  <div className={`w-2 h-2 rounded-full mt-1 ${i < 5 ? 'bg-primary' : 'bg-surface-300'}`} />
                </div>
              ))}
            </div>
          </div>

          <div className="pt-8 flex gap-4">
            <button 
              onClick={() => navigate('/placement')}
              className="flex-grow bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary-600 transition-colors shadow-lg shadow-primary/20"
            >
              Initiate Placement
            </button>
            <button className="px-8 bg-surface-100 border border-surface-200 text-white rounded-xl font-bold hover:bg-surface-200 transition-colors">
              Interview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
