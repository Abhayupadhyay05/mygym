import Link from 'next/link'
import { Plus, Search } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { requireRole } from '@/lib/auth/authorization'
import { memberSearchParamsSchema, memberSearchResultSchema } from '@/lib/validations/member'

const pageSize = 25
const dateFormatter = new Intl.DateTimeFormat('en-IN', {
  dateStyle: 'medium',
  timeZone: 'Asia/Kolkata',
})

type SearchParams = Record<string, string | string[] | undefined>

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

export default async function MembersPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const rawParams = await searchParams
  const parsedParams = memberSearchParamsSchema.safeParse({
    query: firstValue(rawParams.query) ?? '',
    status: firstValue(rawParams.status) ?? 'ALL',
    page: firstValue(rawParams.page) ?? '1',
  })
  if (!parsedParams.success) {
    throw new Error('Invalid member search or pagination options.')
  }

  const { query, status, page } = parsedParams.data
  const { supabase } = await requireRole(['OWNER', 'RECEPTIONIST'])
  const { data, error } = await supabase.rpc('search_members', {
    p_query: query || null,
    p_status: status === 'ALL' ? null : status,
    p_limit: pageSize,
    p_offset: (page - 1) * pageSize,
  })
  if (error) {
    throw new Error('Unable to load members. Confirm the database migration has been applied.')
  }

  const result = memberSearchResultSchema.safeParse(data)
  if (!result.success) {
    throw new Error('The member list returned an unexpected response.')
  }

  const totalPages = Math.max(1, Math.ceil(result.data.total_count / pageSize))
  const pageHref = (nextPage: number) => {
    const params = new URLSearchParams()
    if (query) params.set('query', query)
    if (status !== 'ALL') params.set('status', status)
    params.set('page', String(nextPage))
    return `/admin/members?${params.toString()}`
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#00FF87]">Member management</p>
          <h1 className="mt-2 text-3xl font-bold text-foreground">Members</h1>
          <p className="mt-2 text-muted-foreground">{result.data.total_count.toLocaleString('en-IN')} member records</p>
        </div>
        <Link className={buttonVariants()} href="/admin/members/new">
          <Plus aria-hidden="true" />
          Add member
        </Link>
      </div>

      <form method="get" className="grid gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:grid-cols-[1fr_180px_auto]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input name="query" defaultValue={query} placeholder="Search name, member number, phone or email" className="pl-10" maxLength={100} />
        </div>
        <select name="status" defaultValue={status} aria-label="Filter by member status" className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground">
          <option value="ALL">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="SUSPENDED">Suspended</option>
        </select>
        <Button type="submit" variant="outline">Search</Button>
      </form>

      <section className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]" aria-label="Member records">
        {result.data.items.length === 0 ? (
          <div className="p-8 text-center">
            <h2 className="font-semibold text-foreground">No members found</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {query || status !== 'ALL' ? 'Try another search or clear the status filter.' : 'Add your first member to get started.'}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Member number</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.data.items.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.full_name}</TableCell>
                  <TableCell>{member.member_number}</TableCell>
                  <TableCell>{member.phone}</TableCell>
                  <TableCell>
                    <span className={member.status === 'ACTIVE' ? 'text-[#00FF87]' : 'text-muted-foreground'}>
                      {member.status.charAt(0) + member.status.slice(1).toLowerCase()}
                    </span>
                  </TableCell>
                  <TableCell>{dateFormatter.format(new Date(member.joined_at))}</TableCell>
                  <TableCell>
                    <Link className={buttonVariants({ variant: 'outline', size: 'sm' })} href={`/admin/members/${member.id}/edit`}>
                      View / edit
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
        <span>Page {page} of {totalPages}</span>
        <div className="flex gap-2">
          {page <= 1 ? (
            <span className={buttonVariants({ variant: 'outline', size: 'sm', className: 'pointer-events-none opacity-50' })} aria-disabled="true">
              Previous
            </span>
          ) : (
            <Link className={buttonVariants({ variant: 'outline', size: 'sm' })} href={pageHref(page - 1)}>
              Previous
            </Link>
          )}
          {page >= totalPages ? (
            <span className={buttonVariants({ variant: 'outline', size: 'sm', className: 'pointer-events-none opacity-50' })} aria-disabled="true">
              Next
            </span>
          ) : (
            <Link className={buttonVariants({ variant: 'outline', size: 'sm' })} href={pageHref(page + 1)}>
              Next
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
