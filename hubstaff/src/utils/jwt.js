// Lightweight Client-Side JWT Token Generator & Parser
export function generateJWT(user) {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role, // 'admin' | 'employee'
    designation: user.designation || (user.role === 'admin' ? 'Managing Director / Chief Architect' : 'CAD Drafter'),
    avatar: user.avatar,
    monthlySalary: user.monthlySalary || 28000,
    faceLockEnabled: user.faceLockEnabled || Boolean(user.facePunchRecord),
    facePunchRecord: user.facePunchRecord || null,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86400 * 7, // 7 days validity
  };

  const base64UrlEncode = (obj) => {
    return btoa(unescape(encodeURIComponent(JSON.stringify(obj))))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  };

  const encodedHeader = base64UrlEncode(header);
  const encodedPayload = base64UrlEncode(payload);
  const dummySignature = btoa('raakarshi_drafting_secure_jwt_token_2026')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${encodedHeader}.${encodedPayload}.${dummySignature}`;
}

export function decodeJWT(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('JWT Decode Error:', e);
    return null;
  }
}

// Default Presets
export const PRESET_USERS = {
  admin: {
    id: 'usr-admin',
    name: 'Rahul Agrawal',
    email: 'rahul.agrawal@raakarshidrafting.com',
    role: 'admin',
    designation: 'Managing Director & Chief Architect',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80',
    hourlyRate: 120,
    faceLockEnabled: true,
  }
};
