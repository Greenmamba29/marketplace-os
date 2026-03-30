import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Search, Filter, MapPin, Star, Clock, Award, 
  CheckCircle, X, ChevronDown, Heart, Shield,
  Languages, Briefcase
} from 'lucide-react'
import { useCaregivers } from '../hooks/useCaregivers'
import type { Certification, Specialization, CaregiverFilter } from '../types'

const certifications: { value: Certification; label: string }[] = [
  { value: 'HHA', label: 'Home Health Aide (HHA)' },
  { value: 'CNA', label: 'Certified Nursing Assistant (CNA)' },
  { value: 'LPN', label: 'Licensed Practical Nurse (LPN)' },
  { value: 'RN', label: 'Registered Nurse (RN)' },
  { value: 'LVN', label: 'Licensed Vocational Nurse (LVN)' },
  { value: 'PCA', label: 'Personal Care Aide (PCA)' },
]

const specializations: { value: Specialization; label: string }[] = [
  { value: 'dementia', label: 'Dementia/Alzheimer\'s Care' },
  { value: 'pediatric', label: 'Pediatric Care' },
  { value: 'post-surgical', label: 'Post-Surgical Care' },
  { value: 'mobility', label: 'Mobility Assistance' },
  { value: 'medication', label: 'Medication Management' },
  { value: 'hospice', label: 'Hospice/Palliative Care' },
  { value: 'autism', label: 'Autism Care' },
  { value: 'diabetes', label: 'Diabetes Care' },
]

const languages = ['English', 'Spanish', 'Mandarin', 'Cantonese', 'French', 'Tagalog', 'Vietnamese', 'Korean']

export function CaregiverDirectory() {
  const [showFilters, setShowFilters] = useState(false)
  const [filter, setFilter] = useState<CaregiverFilter>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useCaregivers(filter, page, 10)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setFilter({ ...filter, searchQuery })
    setPage(1)
  }

  const toggleCertification = (cert: Certification) => {
    const current = filter.certifications || []
    const updated = current.includes(cert)
      ? current.filter((c) => c !== cert)
      : [...current, cert]
    setFilter({ ...filter, certifications: updated })
  }

  const toggleSpecialization = (spec: Specialization) => {
    const current = filter.specializations || []
    const updated = current.includes(spec)
      ? current.filter((s) => s !== spec)
      : [...current, spec]
    setFilter({ ...filter, specializations: updated })
  }

  const toggleLanguage = (lang: string) => {
    const current = filter.languages || []
    const updated = current.includes(lang)
      ? current.filter((l) => l !== lang)
      : [...current, lang]
    setFilter({ ...filter, languages: updated })
  }

  const clearFilters = () => {
    setFilter({})
    setSearchQuery('')
    setPage(1)
  }

  const activeFiltersCount = 
    (filter.certifications?.length || 0) +
    (filter.specializations?.length || 0) +
    (filter.languages?.length || 0) +
    (filter.minRating ? 1 : 0) +
    (filter.maxHourlyRate ? 1 : 0) +
    (filter.availableOnly ? 1 : 0) +
    (filter.backgroundChecked ? 1 : 0)

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="container-custom py-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Find Caregivers</h1>
          <p className="text-slate-600">
            Browse {data?.pagination?.total || 0}+ qualified, background-checked caregivers
          </p>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-72 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-xl shadow-card p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-slate-900">Filters</h3>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Availability */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-slate-900 mb-3">Availability</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filter.availableOnly || false}
                      onChange={(e) => setFilter({ ...filter, availableOnly: e.target.checked })}
                      className="w-4 h-4 text-primary-500 border-slate-300 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm text-slate-600">Available now</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filter.backgroundChecked || false}
                      onChange={(e) => setFilter({ ...filter, backgroundChecked: e.target.checked })}
                      className="w-4 h-4 text-primary-500 border-slate-300 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm text-slate-600">Background checked</span>
                  </label>
                </div>
              </div>

              {/* Certifications */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-slate-900 mb-3">Certifications</h4>
                <div className="space-y-2">
                  {certifications.map((cert) => (
                    <label key={cert.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filter.certifications?.includes(cert.value) || false}
                        onChange={() => toggleCertification(cert.value)}
                        className="w-4 h-4 text-primary-500 border-slate-300 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm text-slate-600">{cert.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Specializations */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-slate-900 mb-3">Specializations</h4>
                <div className="space-y-2">
                  {specializations.map((spec) => (
                    <label key={spec.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filter.specializations?.includes(spec.value) || false}
                        onChange={() => toggleSpecialization(spec.value)}
                        className="w-4 h-4 text-primary-500 border-slate-300 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm text-slate-600">{spec.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-slate-900 mb-3">Languages</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {languages.map((lang) => (
                    <label key={lang} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filter.languages?.includes(lang) || false}
                        onChange={() => toggleLanguage(lang)}
                        className="w-4 h-4 text-primary-500 border-slate-300 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm text-slate-600">{lang}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Hourly Rate */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-slate-900 mb-3">Max Hourly Rate</h4>
                <input
                  type="range"
                  min="15"
                  max="100"
                  value={filter.maxHourlyRate || 100}
                  onChange={(e) => setFilter({ ...filter, maxHourlyRate: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-slate-600 mt-1">
                  <span>$15</span>
                  <span>${filter.maxHourlyRate || 100}/hr</span>
                </div>
              </div>

              {/* Rating */}
              <div>
                <h4 className="text-sm font-medium text-slate-900 mb-3">Minimum Rating</h4>
                <div className="flex gap-2">
                  {[4, 4.5, 4.8].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setFilter({ ...filter, minRating: filter.minRating === rating ? undefined : rating })}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        filter.minRating === rating
                          ? 'bg-primary-500 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {rating}+
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search Bar */}
            <div className="bg-white rounded-xl shadow-card p-4 mb-6">
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, skills, or location..."
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50"
                >
                  <Filter className="w-5 h-5" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <span className="px-2 py-0.5 bg-primary-500 text-white text-xs rounded-full">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Search
                </button>
              </form>

              {/* Active Filters */}
              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
                  {filter.certifications?.map((cert) => (
                    <span
                      key={cert}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 text-sm rounded-full"
                    >
                      {cert}
                      <button onClick={() => toggleCertification(cert)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {filter.specializations?.map((spec) => (
                    <span
                      key={spec}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 text-sm rounded-full"
                    >
                      {specializations.find((s) => s.value === spec)?.label}
                      <button onClick={() => toggleSpecialization(spec)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {filter.languages?.map((lang) => (
                    <span
                      key={lang}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 text-sm rounded-full"
                    >
                      {lang}
                      <button onClick={() => toggleLanguage(lang)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Results */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
              </div>
            ) : data?.data?.length === 0 ? (
              <div className="bg-white rounded-xl shadow-card p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No caregivers found</h3>
                <p className="text-slate-600 mb-4">Try adjusting your filters or search criteria</p>
                <button onClick={clearFilters} className="btn-primary">
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-slate-600">
                    Showing {data?.data?.length || 0} of {data?.pagination?.total || 0} caregivers
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600">Sort by:</span>
                    <select className="text-sm border-0 bg-transparent font-medium text-slate-900 focus:ring-0 cursor-pointer">
                      <option>Recommended</option>
                      <option>Highest Rated</option>
                      <option>Lowest Rate</option>
                      <option>Most Experience</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  {data?.data?.map((caregiver) => (
                    <Link
                      key={caregiver.id}
                      to={`/caregivers/${caregiver.id}`}
                      className="block bg-white rounded-xl shadow-card hover:shadow-soft transition-shadow p-6"
                    >
                      <div className="flex flex-col sm:flex-row gap-6">
                        {/* Photo */}
                        <div className="flex-shrink-0">
                          <img
                            src={caregiver.photoUrl || `https://ui-avatars.com/api/?name=${caregiver.firstName}+${caregiver.lastName}&background=random`}
                            alt={`${caregiver.firstName} ${caregiver.lastName}`}
                            className="w-24 h-24 rounded-xl object-cover"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-lg font-semibold text-slate-900">
                                  {caregiver.firstName} {caregiver.lastName}
                                </h3>
                                {caregiver.backgroundCheckStatus === 'completed' && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                                    <Shield className="w-3 h-3" />
                                    Verified
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-slate-600 mb-3">{caregiver.bio}</p>

                              {/* Tags */}
                              <div className="flex flex-wrap gap-2 mb-3">
                                {caregiver.certifications.map((cert) => (
                                  <span
                                    key={cert}
                                    className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-lg font-medium"
                                  >
                                    {cert}
                                  </span>
                                ))}
                                {caregiver.specializations.slice(0, 2).map((spec) => (
                                  <span
                                    key={spec}
                                    className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-lg font-medium"
                                  >
                                    {specializations.find((s) => s.value === spec)?.label}
                                  </span>
                                ))}
                                {caregiver.specializations.length > 2 && (
                                  <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg">
                                    +{caregiver.specializations.length - 2} more
                                  </span>
                                )}
                              </div>

                              {/* Details */}
                              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                                <span className="flex items-center gap-1">
                                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                  {caregiver.rating} ({caregiver.reviewCount} reviews)
                                </span>
                                <span className="flex items-center gap-1">
                                  <Briefcase className="w-4 h-4" />
                                  {caregiver.yearsExperience} years exp
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {caregiver.serviceArea.city}, {caregiver.serviceArea.state}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Languages className="w-4 h-4" />
                                  {caregiver.languages.join(', ')}
                                </span>
                              </div>
                            </div>

                            {/* Rate & CTA */}
                            <div className="flex-shrink-0 text-right">
                              <p className="text-2xl font-bold text-slate-900">
                                ${caregiver.hourlyRate}
                                <span className="text-sm font-normal text-slate-500">/hr</span>
                              </p>
                              <p className="text-sm text-slate-500 mb-3">
                                <Clock className="w-4 h-4 inline mr-1" />
                                {caregiver.status === 'available' ? 'Available' : 'Assigned'}
                              </p>
                              <button className="btn-primary text-sm">
                                View Profile
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {data?.pagination && data.pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                      className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2 text-sm text-slate-600">
                      Page {page} of {data.pagination.totalPages}
                    </span>
                    <button
                      onClick={() => setPage(page + 1)}
                      disabled={page === data.pagination.totalPages}
                      className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
