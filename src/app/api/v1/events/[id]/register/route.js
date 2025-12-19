import { NextResponse } from 'next/server';
import { getMockEventById } from '@/mocks/event.mock';
import { successResponse, errorResponse } from '@/mocks/helpers/response';

// In-memory registrations store
let mockRegistrationsStore = [];

/**
 * POST /api/v1/events/:id/register
 * Etkinliğe kayıt ol
 */
export async function POST(request, { params }) {
    try {
        // Next.js 13+ App Router'da params async olabilir
        const resolvedParams = await params;
        const { id } = resolvedParams;
        const data = await request.json();
        
        if (!id) {
            return errorResponse('Etkinlik ID gerekli', 400);
        }
        
        const event = getMockEventById(id);
        
        if (!event) {
            return errorResponse('Etkinlik bulunamadı', 404);
        }
        
        // Check capacity
        if (event.registeredCount >= event.capacity) {
            return errorResponse('Etkinlik dolu', 400);
        }
        
        // Check registration deadline
        const deadline = new Date(event.registrationDeadline);
        const now = new Date();
        if (now > deadline) {
            return errorResponse('Kayıt son tarihi geçmiştir', 400);
        }
        
        // Create registration
        const registration = {
            id: `reg-${Date.now()}`,
            eventId: id,
            userId: 1, // Mock user ID
            registrationDate: new Date().toISOString(),
            qrCode: `EVENT-${id}-${Date.now()}`,
            checkedIn: false,
            checkedInAt: null,
            customFields: data
        };
        
        mockRegistrationsStore.push(registration);
        
        // Update event registered count
        event.registeredCount += 1;
        
        return successResponse(registration, 'Etkinliğe başarıyla kayıt oldunuz!');
    } catch (error) {
        return errorResponse(error.message, 500);
    }
}

