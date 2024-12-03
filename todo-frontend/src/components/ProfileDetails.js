import { UserIcon, PhoneIcon, CalendarIcon } from '@heroicons/react/24/outline';

export default function ProfileDetails({ profile }) {
  return (
    <div className="bg-white shadow rounded-lg p-6 space-y-6">
      <div className="flex items-center space-x-4 border-b pb-4">
        <UserIcon className="w-6 h-6 text-green-500" />
        <div>
          <h3 className="text-sm font-semibold text-gray-700">Nom d'utilisateur</h3>
          <p className="text-base text-gray-900 font-medium">{profile.username}</p>
        </div>
      </div>
      <div className="flex items-center space-x-4 border-b pb-4">
        <PhoneIcon className="w-6 h-6 text-green-500" />
        <div>
          <h3 className="text-sm font-semibold text-gray-700">Numéro de téléphone</h3>
          <p className="text-base text-gray-900 font-medium">{profile.phone}</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <CalendarIcon className="w-6 h-6 text-green-500" />
        <div>
          <h3 className="text-sm font-semibold text-gray-700">Date de naissance</h3>
          <p className="text-base text-gray-900 font-medium">
            {new Date(profile.dateOfBirth).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
