import React, { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';

const AllAppointments = () => {
  const { aToken, appointments, getAllAppointments, cancelAppointment } = useContext(AdminContext);
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);

  // State to manage modal visibility and selected appointment
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedAppointment(null);
  };

  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium'>All Appointments</p>
      
      {/* Wrapper div to enable a scroll bar on overflow */}
      <div className='bg-white border rounded text-sm max-h-[80vh] overflow-y-auto'>
        <div className='hidden sm:grid grid-cols-[0.5fr_2fr_1fr_2fr_2fr_1fr_1fr_1fr] py-3 px-6 border-b'>
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Details</p>
          <p>Actions</p>
        </div>

        {appointments.length === 0 ? (
          <p className='text-center py-5'>No appointments found.</p>
        ) : (
          appointments.reverse().map((item, index) => (
            <div 
              className='flex flex-wrap sm:grid sm:grid-cols-[0.5fr_2fr_1fr_2fr_2fr_1fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50' 
              key={item._id}
            >
              <p className='hidden sm:block'>{index + 1}</p>
              <div className='flex items-center gap-2'>
                <img className='w-8 rounded-full' src={item.userData.image || 'default_image_url'} alt={item.userData.name || 'Patient'} />
                <p>{item.userData.name || 'Unknown Patient'}</p>
              </div>
              <p className='hidden sm:block'>{calculateAge(item.userData.dob)}</p>
              <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
              <div className='flex items-center gap-2'>
                <img className='w-8 rounded-full bg-gray-200' src={item.docData.image || 'default_image_url'} alt={item.docData.name || 'Doctor'} />
                <p>{item.docData.name || 'Unknown Doctor'}</p>
              </div>
              <p>{currency} {Number.isFinite(item.amount) ? item.amount : 'N/A'}</p>
              <img onClick={() => handleViewDetails(item)} className='w-6 cursor-pointer' src={assets.list_icon} alt="View Details" />
              
              {/* Actions Column */}
              <div className='flex justify-center items-center'> 
                {item.cancelled ? (
                  <p className='text-red-400 text-xs font-medium'>Cancelled</p>
                ) : item.isCompleted ? (
                  <p className='text-green-500 text-xs font-medium'>Completed</p>
                ) : (
                  <img onClick={() => cancelAppointment(item._id)} className='w-6 cursor-pointer' src={assets.cancel_icon} alt="Cancel Appointment" />
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Inline Modal to show appointment details */}
      {modalOpen && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-5 rounded shadow-lg max-w-sm">
            <h2 className="text-lg font-bold">Appointment Details</h2>
            <p><strong>Symptoms:</strong> {selectedAppointment.symptom || 'N/A'}</p>
            <p><strong>Duration of Symptoms:</strong> {selectedAppointment.durationOfSymptom || 'N/A'}</p>
            <p><strong>Health Insurance:</strong> {selectedAppointment.healthInsurance || 'N/A'}</p>
            <button onClick={handleCloseModal} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllAppointments;


