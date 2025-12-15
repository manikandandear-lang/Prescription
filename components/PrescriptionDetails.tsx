import React from 'react';
import { PrescriptionData, Medication } from '../types';
import { User, Stethoscope, Pill, Calendar, Clock, AlertCircle, FileText } from 'lucide-react';

interface PrescriptionDetailsProps {
  data: PrescriptionData;
}

const PrescriptionDetails: React.FC<PrescriptionDetailsProps> = ({ data }) => {
  if (!data.isPrescription) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-red-800">Not a Prescription</h3>
        <p className="mt-2 text-sm text-red-600">
          The analyzed image does not appear to be a valid medical prescription. Please try uploading a clearer image or a valid document.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Info: Doctor & Patient */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Doctor Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-2 rounded-full mr-3 text-blue-600">
              <Stethoscope size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Doctor Details</h3>
          </div>
          <div className="space-y-2 text-sm flex-grow">
            <p className="font-medium text-lg text-gray-900">{data.doctor?.name || 'Unknown Doctor'}</p>
            <p className="text-gray-500">{data.doctor?.specialty}</p>
            <p className="text-gray-500">{data.doctor?.hospital}</p>
            {data.doctor?.licenseNumber && (
              <p className="text-xs text-gray-400 mt-2 pt-2 border-t">Lic: {data.doctor.licenseNumber}</p>
            )}
          </div>
        </div>

        {/* Patient Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
           <div className="flex items-center mb-4">
            <div className="bg-green-100 p-2 rounded-full mr-3 text-green-600">
              <User size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Patient Details</h3>
          </div>
          <div className="space-y-2 text-sm flex-grow">
            <p className="font-medium text-lg text-gray-900">{data.patient?.name || 'Unknown Patient'}</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {data.patient?.age && (
                <span className="px-2 py-1 bg-gray-100 rounded text-gray-600 text-xs">Age: {data.patient.age}</span>
              )}
              {data.patient?.gender && (
                <span className="px-2 py-1 bg-gray-100 rounded text-gray-600 text-xs">{data.patient.gender}</span>
              )}
              {data.patient?.weight && (
                <span className="px-2 py-1 bg-gray-100 rounded text-gray-600 text-xs">{data.patient.weight}</span>
              )}
            </div>
            {data.date && (
                <p className="text-gray-500 mt-2 flex items-center">
                    <Calendar size={14} className="mr-1"/> {data.date}
                </p>
            )}
          </div>
        </div>
      </div>

      {/* Diagnosis & Advice */}
      {(data.diagnosis || data.generalAdvice) && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
           <div className="flex items-center mb-4">
            <div className="bg-purple-100 p-2 rounded-full mr-3 text-purple-600">
              <FileText size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Diagnosis & Notes</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {data.diagnosis && (
                 <div>
                     <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Diagnosis</h4>
                     <p className="text-gray-700">{data.diagnosis}</p>
                 </div>
             )}
             {data.generalAdvice && (
                 <div>
                     <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">General Advice</h4>
                     <p className="text-gray-700">{data.generalAdvice}</p>
                 </div>
             )}
          </div>
        </div>
      )}

      {/* Medications List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div className="flex items-center">
            <div className="bg-medical-100 p-2 rounded-full mr-3 text-medical-600">
              <Pill size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Medications</h3>
          </div>
          <span className="text-sm text-gray-500">{data.medications?.length || 0} Prescribed</span>
        </div>
        
        <div className="divide-y divide-gray-100">
          {data.medications && data.medications.length > 0 ? (
            data.medications.map((med: Medication, index: number) => (
              <div key={index} className="p-4 md:p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                         <h4 className="text-lg font-medium text-medical-900">{med.name}</h4>
                         {med.type && (
                             <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wide">
                                 {med.type}
                             </span>
                         )}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600">
                      {med.dosage && (
                          <span className="font-semibold text-gray-900">Dosage: {med.dosage}</span>
                      )}
                      {med.duration && (
                          <span className="flex items-center"><Clock size={14} className="mr-1 text-gray-400"/> {med.duration}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-1 md:text-right">
                    <div className="inline-block text-left md:text-right">
                        <p className="text-sm font-medium text-gray-900 mb-1">{med.frequency}</p>
                        {med.instructions && (
                             <p className="text-sm text-gray-500 italic">"{med.instructions}"</p>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
                No medications extracted from the document.
            </div>
          )}
        </div>
      </div>
      
      {data.followUpDate && (
          <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 flex items-center justify-center text-yellow-800 text-sm font-medium">
              <Calendar size={16} className="mr-2" />
              Follow up required on: {data.followUpDate}
          </div>
      )}
    </div>
  );
};

export default PrescriptionDetails;