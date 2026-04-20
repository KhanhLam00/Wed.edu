export function logoutUser(navigate) {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('username');
  localStorage.removeItem('role');
  localStorage.removeItem('avatar');
  localStorage.removeItem('userAvatar');
  localStorage.removeItem('classroomId');
  localStorage.removeItem('className');
  localStorage.removeItem('gradeLevel');
  localStorage.removeItem('needChooseRealClass');

  navigate('/auth-choice');
}