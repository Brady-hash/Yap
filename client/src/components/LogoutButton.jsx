import { BiLogOut } from "react-icons/bi";
import { useAuthContext } from '../context/AuthContext';
const LogoutButton = () => {
    const { loading, logout } = useAuthContext;
    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }
    return (
        <div className='mt-auto'>
            {!loading ? (
                <BiLogOut className='w-6 h-6 text-white cursor-pointer' onClick={handleLogout} />
            ) : (
                <span className='loading loading-spinner'></span>
            )}
        </div>
    );
};
export default LogoutButton;