import { NextResponse } from 'next/server';
import { getMockEventById } from '@/mocks/event.mock';
import { successResponse, errorResponse } from '@/mocks/helpers/response';

/**
 * GET /api/v1/events/:id
 * Etkinlik detayı
 */
export async function GET(request, { params }) {
    try {
        const { id } = params;
        
        if (!id) {
            return errorResponse('Etkinlik ID gerekli', 400);
        }
        
        const event = getMockEventById(id);
        
        if (!event) {
            return errorResponse('Etkinlik bulunamadı', 404);
        }
        
        return successResponse(event);
    } catch (error) {
        return errorResponse(error.message, 500);
    }
}

