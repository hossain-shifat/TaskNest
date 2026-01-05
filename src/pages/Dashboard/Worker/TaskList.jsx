import React, { useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Calendar, DollarSign, Eye, User, Users } from 'lucide-react'
import useAxiosSecure from '../../../hooks/UseAxiosSecure'
import { Link } from 'react-router'
import gsap from 'gsap'

const TaskList = () => {
    const axiosSecure = useAxiosSecure()
    const cardsRef = useRef([])

    const { data: tasks = [], isLoading } = useQuery({
        queryKey: ['available-tasks'],
        queryFn: async () => {
            const res = await axiosSecure.get('/tasks/available')
            return res.data
        }
    })

    // useEffect(() => {
    //     if (tasks.length > 0 && !isLoading) {
    //         gsap.from(cardsRef.current, {
    //             y: 50,
    //             opacity: 0,
    //             duration: 0.5,
    //             stagger: 0.1,
    //             ease: 'power3.out'
    //         })
    //     }
    // }, [tasks, isLoading])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold mb-2">Available Tasks</h1>
                <p className="text-base-content/60">Browse and complete tasks to earn coins</p>
            </div>

            {/* Task Cards */}
            {tasks.length === 0 ? (
                <div className="text-center py-16 text-base-content/60">
                    <Users size={64} className="mx-auto mb-4 opacity-30" />
                    <p className="text-xl">No tasks available at the moment</p>
                    <p className="text-sm mt-2">Check back later for new opportunities!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tasks.map((task, index) => (
                        <div
                            key={task._id}
                            ref={(el) => (cardsRef.current[index] = el)}
                            className="task-card bg-base-200 rounded-lg overflow-hidden shadow-md"
                        >
                            {/* Task Image */}
                            <div className="h-48 overflow-hidden">
                                <img
                                    src={task.task_image_url}
                                    alt={task.task_title}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Task Content */}
                            <div className="p-5 space-y-4">
                                {/* Task Title */}
                                <h3 className="text-xl font-bold line-clamp-2 min-h-14">
                                    {task.task_title}
                                </h3>

                                {/* Task Info */}
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-base-content/70">
                                        <User size={16} />
                                        <span>Buyer: {task.buyerName}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-base-content/70">
                                        <Calendar size={16} />
                                        <span>Deadline: {new Date(task.completion_date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-base-content/70">
                                        <Users size={16} />
                                        <span>Workers Needed: {task.required_workers}</span>
                                    </div>
                                </div>

                                {/* Payable Amount */}
                                <div className="flex items-center justify-between pt-3 border-t border-base-300">
                                    <span className="badge badge-success gap-2 py-3 px-4">
                                        <DollarSign size={16} />
                                        <span className="font-semibold">{task.payable_amount} coins</span>
                                    </span>
                                    <Link
                                        to={`/dashboard/task-details/${task._id}`}
                                        className="btn btn-primary btn-sm gap-2"
                                    >
                                        <Eye size={16} />
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default TaskList
