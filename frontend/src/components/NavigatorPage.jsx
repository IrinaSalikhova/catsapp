// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import '../assets/NavigatorPage.css';

// const NavigatorPage = () => {
//     const navigate = useNavigate();
// return (
//     <div className="navigator-page">
//     <div className="container">
//     <div className="header">
//       <div className="logo">
//         <img src="image/carlington_icon.webp" alt="Logo">
//         <div className="title">Asset Management</div>
//       </div>
//     </div>
//     <div className="main">
//       <div className="sidebar">
//         <ul className="nav">
//           <li><a href="#notification">Notification</a></li>
//           <li><a href="#database">Database</a></li>
//           <li><a href="#asset-review">Asset Review</a></li>
//         </ul>
//       </div>
//       <div className="content">
//         <div className="section1" id="notification">
//           <div className="section-header">Notification</div>
//           <div className="new-asset-box">New asset Suggestion1</div>
//           <div className="new-asset-box">New asset edit</div>
//           <div className="new-asset-box">New asset suggestion2</div>
//         </div>
//         <div className="section2" id="database">
//           <div className="section-header">Database</div>
//           <table className="database-table">
//             <tr>
//               <th>ID</th>
//               <th>Address</th>
//               <th>Category</th>
//               <th>Attribute 1</th>
//               <th>Attribute 2</th>
//               <th>Attribute 3</th>
//             </tr>
//             <tr>
//               <td>1</td>
//               <td>1303 Leaside Av, Ottawa, ON</td>
//               <td>Religious</td>
//               <td>Attribute 1</td>
//               <td>Attribute 2</td>
//               <td>Attribute 3</td>
//             </tr>
//             <tr>
//               <td>2</td>
//               <td>960 Silver St, Ottawa, ON</td>
//               <td>Park</td>
//               <td>Attribute 1</td>
//               <td>Attribute 2</td>
//               <td>Attribute 3</td>
//             </tr>
//             <tr>
//               <td>3</td>
//               <td>1400 Coldrey Ave, Ottawa, ON</td>
//               <td>Religious</td>
//               <td>Attribute 1</td>
//               <td>Attribute 2</td>
//               <td>Attribute 3</td>
//             </tr>
//           </table>
//         </div>
//       </div>
//       <div className="content1">
//         <div className="section" id="asset-review">
//           <div className="section-header">Asset Review</div>
//           <div className="new-asset-box">
//             <strong>Asset 1</strong><br></br>
//             Asset Name:<br></br>
//             Asset Description:<br></br>
//             Hours of Operation:<br></br>
//             Phone Number:<br></br>
//             Email:<br></br>
//             Website:<br></br>
//             Description:
//           </div>
//           <div className="mapcontainer">
//             <div className="map" id="map"></div>
//           </div>
//           <div className="actions">
//             <button className="button approve">Approve</button>
//             <button className="button decline">Decline</button>
//           </div>
//         </div>
//       </div>
//     </div>
//     );
// };

// export default NavigatorPage;