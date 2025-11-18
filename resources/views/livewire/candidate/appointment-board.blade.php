<div class="space-y-4">
    <div class="flex flex-wrap gap-3">
        <label class="text-sm text-gray-600 dark:text-gray-300">
            {{ __('Filter status') }}
            <select wire:model="statusFilter" class="ml-2 rounded-md border-gray-300 shadow-sm">
                <option value="pending">{{ __('Pending') }}</option>
                <option value="approved">{{ __('Approved') }}</option>
                <option value="rejected">{{ __('Rejected') }}</option>
                <option value="cancelled">{{ __('Cancelled') }}</option>
                <option value="all">{{ __('All') }}</option>
            </select>
        </label>
    </div>

    <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
            <thead class="bg-gray-50 dark:bg-gray-800 text-gray-600">
                <tr>
                    <th class="px-4 py-2 text-left">{{ __('Citizen') }}</th>
                    <th class="px-4 py-2 text-left">{{ __('Contact') }}</th>
                    <th class="px-4 py-2 text-left">{{ __('Preferred Time') }}</th>
                    <th class="px-4 py-2 text-left">{{ __('Topic') }}</th>
                    <th class="px-4 py-2 text-left">{{ __('Status') }}</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900">
                @forelse ($appointments as $appointment)
                    <tr>
                        <td class="px-4 py-3 font-semibold text-gray-900 dark:text-white">{{ $appointment->citizen_name }}</td>
                        <td class="px-4 py-3 text-gray-600">
                            @if($appointment->citizen_email)
                                <a href="mailto:{{ $appointment->citizen_email }}" class="block text-indigo-500">{{ $appointment->citizen_email }}</a>
                            @endif
                            @if($appointment->citizen_phone)
                                <a href="tel:{{ $appointment->citizen_phone }}" class="block text-indigo-500">{{ $appointment->citizen_phone }}</a>
                            @endif
                        </td>
                        <td class="px-4 py-3">{{ optional($appointment->preferred_at)->format('d M Y H:i') ?? __('Flexible') }}</td>
                        <td class="px-4 py-3">{{ $appointment->topic ?? __('General consultation') }}</td>
                        <td class="px-4 py-3">
                            <select wire:change="updateStatus({{ $appointment->id }}, $event.target.value)" class="rounded-md border-gray-300 text-sm">
                                @foreach (['pending','approved','rejected','cancelled'] as $status)
                                    <option value="{{ $status }}" @selected($appointment->status === $status)>{{ ucfirst($status) }}</option>
                                @endforeach
                            </select>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="5" class="px-4 py-6 text-center text-gray-500">{{ __('No appointments yet.') }}</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>
