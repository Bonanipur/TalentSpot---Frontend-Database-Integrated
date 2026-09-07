import { useState } from 'react';
import { ArrowRight, UserCheck } from 'lucide-react';
import type { PageName } from '@/data/mockData';
import { INDIAN_STATES, DISTRICTS_BY_STATE, SPORTS, GENDERS } from '@/data/mockData';
import ProgressIndicator from '@/components/ProgressIndicator';

interface RegisterPageProps {
  onNavigate: (page: PageName) => void;
  onRegister: (data: { name: string; age: string; gender: string; state: string; district: string; sport: string }) => void;
}

export default function RegisterPage({ onNavigate, onRegister }: RegisterPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    state: '',
    district: '',
    sport: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const districts = formData.state ? DISTRICTS_BY_STATE[formData.state] || [] : [];

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value, ...(field === 'state' ? { district: '' } : {}) }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Please enter a name';
    if (!formData.age) newErrors.age = 'Please enter age';
    if (!formData.gender) newErrors.gender = 'Please select gender';
    if (!formData.state) newErrors.state = 'Please select state';
    if (!formData.district) newErrors.district = 'Please select district';
    if (!formData.sport) newErrors.sport = 'Please select sport';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onRegister(formData);
    onNavigate('trial-select');
  };

  const inputClass = (field: string) =>
    `input-field ${errors[field] ? 'border-red-400 focus:border-red-500' : ''}`;

  return (
    <div className="bg-mesh min-h-[calc(100vh-4rem)] py-10">
      <div className="section-padding">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8 animate-fade-in-up">
            <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-royal-600 to-sky-500 items-center justify-center shadow-lg shadow-royal-500/25 mb-4">
              <UserCheck className="w-7 h-7 text-white" />
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-navy-900 mb-2">
              Let's Get Started 👋
            </h1>
            <p className="text-slate-500 text-lg">Tell us a little about the athlete.</p>
          </div>

          <div className="mb-8 animate-fade-in-up animate-delay-100">
            <ProgressIndicator steps={['Profile', 'Trial', 'Results']} currentStep={0} />
          </div>

          <div className="card p-6 sm:p-8 animate-fade-in-up animate-delay-200">
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-navy-900 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rohan Sharma"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={inputClass('name')}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1.5">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-navy-900 mb-2">Age</label>
                <input
                  type="number"
                  placeholder="e.g. 16"
                  value={formData.age}
                  onChange={(e) => handleChange('age', e.target.value)}
                  className={inputClass('age')}
                />
                {errors.age && <p className="text-red-500 text-sm mt-1.5">{errors.age}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-navy-900 mb-2">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleChange('gender', e.target.value)}
                  className={inputClass('gender')}
                >
                  <option value="">Select gender</option>
                  {GENDERS.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
                {errors.gender && <p className="text-red-500 text-sm mt-1.5">{errors.gender}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-navy-900 mb-2">State</label>
                <select
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  className={inputClass('state')}
                >
                  <option value="">Select state</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {errors.state && <p className="text-red-500 text-sm mt-1.5">{errors.state}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-navy-900 mb-2">District</label>
                <select
                  value={formData.district}
                  onChange={(e) => handleChange('district', e.target.value)}
                  className={inputClass('district')}
                  disabled={!formData.state}
                >
                  <option value="">Select district</option>
                  {districts.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                {errors.district && <p className="text-red-500 text-sm mt-1.5">{errors.district}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-navy-900 mb-2">Sport</label>
                <select
                  value={formData.sport}
                  onChange={(e) => handleChange('sport', e.target.value)}
                  className={inputClass('sport')}
                >
                  <option value="">Select sport</option>
                  {SPORTS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {errors.sport && <p className="text-red-500 text-sm mt-1.5">{errors.sport}</p>}
              </div>
            </div>

            <button onClick={handleSubmit} className="btn-primary w-full mt-6 text-base">
              Continue to Trial <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
